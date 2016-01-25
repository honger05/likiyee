var PullDown = function(element, opions) {
  var $main = $('#wrapper')
  var $list = $main.find('#events-list')
  var $pullDown = $main.find('#pull-down')
  var $pullDownLabel = $main.find('#pull-down-label')
  var topOffset = -$pullDown.outerHeight()

  this.compiler = Handlebars.compile($('#tpi-list-item').html())
  // this.prev = this.next = this.start = options.params.start
  // this.total = null

  this.renderList = function(start, type) {
    var _this = this
    var $el = $pullDown

    var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    var html = _this.compiler(data)

    setTimeout(function() {
      if (type === 'refresh') {
        $list.children('li').first().before(html)
      } else {
        $list.html(html)
      }

      setTimeout(function() {
        _this.iScroll.refresh()
      }, 100)

      _this.resetLoading($el)
      _this.iScroll.scrollTo(0, topOffset, 800, $.AMUI.iScroll.utils.circular)
    }, 1000)
  }

  this.setLoading = function($el) {
    $el.addClass('loading');
  };

  this.resetLoading = function($el) {
    $el.removeClass('loading');
  };

  this.init = function() {
    var myScroll = this.iScroll = new $.AMUI.iScroll('#wrapper', {
      click: true
    })

    var _this = this, pullFormTop = false, pullStart

    this.renderList()

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
    })

    this.handlePullDown = function() {
      console.log('handle pull down')
      this.setLoading($pullDown)
      this.renderList(null, 'refresh')
    }
  }
}

module.exports = PullDown
