
var Message = function(msg, socket) {

  if (typeof msg.t !== "string")
    this.invalid = true;

  // Message Type
  this._t = msg.t || undefined;

  // Message Data
  this._d = msg.d;

  // Message reply address
  if (msg.r)
    this._r = msg.r;
  else
    this.noreply = true;

  // Message original reply to
  this._o = msg.o;

  // Can't be a reply without an original
  if (this._t === 'reply' && !this._o)
    this.invalid =true;


  // The sender
  this._s = socket;

};

Message.prototype.isReply = function() {
  return (this._t === 'reply');
};

Message.prototype.getReplyReceiver = function() {
  return this._o;
};

Message.prototype.getType = function() {
  return this._t;
};

Message.prototype.getData = function() {
  return this._d;
};

Message.prototype.reply = function(data, reply) {
  this._s.send('reply', data, reply, this._r);
};

module.exports = Message;
