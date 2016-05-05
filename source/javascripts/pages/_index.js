/* globals YAML,Gengo */
var example =
  'en:\n' +
  '  title: My Website\n' +
  '  description: A %{website_type} website, made by <a href="http://example.com">me</a>.\n';

$(function(){
  var module = {
    exampleObj: {'en': {'title': 'My Website', 'description': 'A %{website_type} website, made by <a href="http://example.com">me</a>.'}}
    , yaml2gengo: function () {
      var raw = $('#raw').val()
      , parsed = YAML.parse(raw)
      , gengo = Gengo.stringify(parsed);

      $('#converted').val(gengo);
    }
    , send2Gengo: function () {
      var gengo = $('#converted').val();
      var $form = $(
        '<form action="https://gengo.com/order/receive_job_post/" name="translateForm" method="post" target="_blank">' +
        '<input type="hidden" name="referrer" value="order">' +
        '<input type="hidden" name="lc_src" value="en-US">' +
        '<input type="hidden" name="body_src" value="' + gengo.replace(/"/g, '&quot;') + '">' +
        '</form>'
      );
      $('body').append($form);
      $form.submit();
    }
    , gengo2yaml: function () {
      var raw = $('#raw').val()
      , parsed = Gengo.parse(raw)
      , yaml = YAML.stringify(parsed, 10, 2);

      $('#converted').val(yaml);
    }
    , insertGengo: function () {
      $('#raw').val(Gengo.stringify(module.exampleObj));
      module.gengo2yaml();
    }
    , insertYAML: function () {
      $('#raw').val(YAML.stringify(module.exampleObj, 4, 2));
      module.yaml2gengo();
    }
  };

  $('#yaml2gengo').on('click', module.yaml2gengo);
  $('#gengo2yaml').on('click', module.gengo2yaml);
  $('#toGengo').on('click', module.send2Gengo);
  $('#insertGengo').on('click', module.insertGengo);
  $('#insertYAML').on('click', module.insertYAML);

  module.insertYAML();
});
