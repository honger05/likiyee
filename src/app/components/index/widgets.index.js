
!function (hbs) {

  hbs.registerPartial('menulist', '{{#each this}}<li class="am-animation-slide-bottom"><a href="{{href}}"><i class="am-{{icon}} am-icon-fw"></i> {{name}}<i class="am-icon-angle-right am-fr"></i></a></li>{{/each}}')

}(Handlebars)
