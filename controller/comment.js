/**
 * Created by petitspois on 15/2/25.
 */

var level = require('../server/config').level,
	model = require('../model/').post,
	userModel = require('../model/').user,
	commentModel = require('../model/').comment,
	actionModel = require('../model/').action,
	notificationModel = require('../model/').notification,
	marked = require('../assets/js/editor/marked');
marked.setOptions({
	renderer: new marked.Renderer(),
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: true,
	smartLists: true,
	smartypants: false
});


module.exports = function() {

	var comment = {};

	//post comment
	comment.comment = function*() {

		var ctx = this,
			userSession = ctx.session.user || '',
			body = ctx.request.body,
			comment = body.comment,
			pid = body.pid,
			reply = body.reply;

		if (!userSession) {
			ctx.body = {
				msg: '未登录，登陆跳转中...',
				status: 2
			}
			return;
		}

		if (!comment) {
			ctx.body = {
				msg: '评论内容不能为空',
				status: 0
			}
			return;
		}

		var userId = userSession._id || (yield userModel.get({
				email: userSession.email
			}))._id,

			commentData = {
				pid: pid,
				name: userSession.nickname,
				email: userSession.email,
				comment: comment,
				author: userId
			};

		if (reply) commentData.reply = reply;

		//save commentData
		var commented = yield commentModel.add(commentData),
			actionTarget = '',
			backUser = null;

		//update time
		yield model.update({
			_id: pid
		}, {
			$set: {
				updatetime: Date.now()
			}
		});

		//increase level
		backUser = yield userModel.update({
			_id: userId
		}, {
			$inc: {
				level: level.cc
			}
		});

		if (!backUser.role && backUser.level > 1000) {
			yield userModel.update({
				_id: userId
			}, {
				$set: {
					role: 1
				}
			});
		}

		//notification
		var notificationData = {
			type: 'post',
			source: userSession._id || (yield userModel.get({
				email: userSession.email
			}, '_id'))._id,
			resource: pid,
			location: (yield commentModel.get({
				name: commentData.name
			}, '', '-createtime'))._id
		}

		if (reply) {
			notificationData.hasReply = true;
			notificationData.target = (yield userModel.get({
				nickname: reply
			}, '_id'))._id;
			actionTarget = notificationData.target;
		} else {
			notificationData.target = (yield model.get({
				_id: pid
			})).author;
			actionTarget = pid;
		}

		//save notifications
		yield notificationModel.add(notificationData);

		//save actionData
		yield actionModel.add({
			type: reply ? 'reply' : 'comment',
			uid: commentData.author,
			name: commentData.name,
			rid: actionTarget,
			comment: commentData.comment
		});

		//async callbacks
		var backData = {
			name: this.session.user.nickname,
			createtime: '即将',
			comment: marked(comment),
			avatar: (yield userModel.get({
				email: this.session.user.email
			}, 'avatar')).avatar
		}

		if(reply) backData.reply = reply;

		if (commented) {
			this.body = {
				msg: '发布成功',
				status: 1,
				data: backData
			}
		}

	}


	//remove comment
	comment.remove = function*() {
		var ctx = this,
            userSession = ctx.session.user || '',
            body = ctx.request.body,
			cid = body.cid,
			userId = userSession._id || (yield userModel.get({
				email: userSession.email
			}))._id;

		if (cid) {

			var cData = yield commentModel.byidRemove(cid);

			if (cData) {
				//decrease level
				yield userModel.update({
					_id: userId
				}, {
					$inc: {
						level: -level.cc
					}
				});
				this.body = {
					msg: '删除成功',
					status: 1
				}
			} else {
				this.body = {
					msg: '删除失败',
					status: 0
				}
			}
		} else {
			this.body = {
				msg: 'cid不存在',
				status: 0
			}
		}

	}

	return comment;
}
