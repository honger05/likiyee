
var Pull = function(element, options) {

  var $main = $('#wrapper')
  var $list = $main.find(options.list_id)
  var $pullDown = $main.find('#pull-down')
  var $pullDownLabel = $main.find('#pull-down-label')
  var $pullUp = $main.find('#pull-up')
  var topOffset = -$pullDown.outerHeight()
  var iScroll = $.AMUI.iScroll

  this.compiler = Handlebars.compile($(options.item_id).html())
  this.prev = this.next = this.start = options.start
  this.total = null

  this.renderList = function(start, type) {
    var _this = this
    var $el = $pullDown

    if (type === 'load') {
      $el = $pullUp
    }

    var page = options.pagenation(start, options.count)

    var html = _this.compiler(page[0])

    _this.total = page[1]

    setTimeout(function() {
      if (type === 'refresh') {
        $list.children('li').first().before(html)
      } else if (type === 'load') {
        $list.append(html)
      } else {
        $list.html(html)
      }

      setTimeout(function() {
        _this.iScroll.refresh()
      }, 100)

      _this.resetLoading($el)

      if (type !== 'load') {
        _this.iScroll.scrollTo(0, topOffset, 800, iScroll.utils.circular)
      }

    }, 1000)
  }

  this.setLoading = function($el) {
    $el.addClass('loading');
  };

  this.resetLoading = function($el) {
    $el.removeClass('loading');
  };

  this.init = function() {
    var myScroll = this.iScroll = new iScroll('#wrapper', {
      click: true
    })

    var _this = this, pullFormTop = false, pullStart

    this.renderList(this.start)

    myScroll.on('scrollStart', function() {
      if (this.y >= topOffset) {
        pullFormTop = true
      }
      pullStart = this.y
    })

    myScroll.on('scrollEnd', function() {
      if (pullFormTop && this.directionY === -1) {
        _this.handlePullDown()
      }
      pullFormTop = false;

      if (pullStart === this.y && (this.directionY === 1)) {
        _this.handlePullUp()
      }
    })

    this.handlePullDown = function() {
      console.log('handle pull down')
      if (this.prev > 0) {
        this.prev -= options.count
        this.setLoading($pullDown)
        this.renderList(this.prev, 'refresh')
      } else {
        console.log('别刷了，没有了');
      }
    }

    this.handlePullUp = function() {
      console.log('handle pull up');
      if (this.next < this.total) {
        this.setLoading($pullUp);
        this.next += options.count;
        this.renderList(this.next, 'load');
      } else {
        console.log(this.next);
        // this.iScroll.scrollTo(0, topOffset);
      }
    }
  }
}

module.exports = Pull
