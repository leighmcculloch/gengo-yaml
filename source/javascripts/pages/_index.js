 /* globals YAML,Gengo,ga */
var example =
  'en:\n' +
  '  title: My Website\n' +
  '  description: A %{website_type} website, made by <a href="http://example.com">me</a>.\n';

$(function(){
  var module = {
    exampleObj: {'en': {'title': 'My Website', 'description': 'A %{website_type} website, made by <a href="http://example.com">me</a>.'}}
    , yaml2gengo: function (evt) {
      var raw = $('#raw').val()
      , parsed = YAML.parse(raw)
      , gengo = Gengo.stringify(parsed);

      $('#converted').val(gengo);
      $('#toGengo').prop('disabled', false);
      if (evt) {
        ga('send', {
          hitType: 'event',
          eventCategory: 'CTA',
          eventAction: 'click',
          eventLabel: 'YAML => Gengo'
        });
      }
    }
    , send2Gengo: function (evt) {
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

      if (evt) {
        ga('send', {
          hitType: 'event',
          eventCategory: 'CTA',
          eventAction: 'click',
          eventLabel: 'Send => Gengo'
        });
      }
    }
    , gengo2yaml: function (evt) {
      var raw = $('#raw').val()
      , parsed = Gengo.parse(raw)
      , yaml = YAML.stringify(parsed, 10, 2);

      $('#converted').val(yaml);
      $('#toGengo').prop('disabled', true);

      if (evt) {
        ga('send', {
          hitType: 'event',
          eventCategory: 'CTA',
          eventAction: 'click',
          eventLabel: 'Gengo => YAML'
        });
      }
    }
    , insertGengo: function () {
      $('#raw').val(Gengo.stringify(module.exampleObj));
      module.gengo2yaml();
    }
    , insertYAML: function () {
      $('#raw').val(YAML.stringify(module.exampleObj, 4, 2));
      module.yaml2gengo();
    }
    , send2Clipboard: function (e) {
      // find target element
      var t = e.target
      , c = t.dataset.copytarget
      , inp = $(c);

      // is element selectable?
      if (inp && !!inp.select) {

        // select text
        inp.select();

        try {
          // copy text
          document.execCommand('copy');
          inp.blur();
        }
        catch (err) {
          alert('please press Ctrl/Cmd+C to copy');
        }

      }
      if (e) {
        ga('send', {
          hitType: 'event',
          eventCategory: 'CTA',
          eventAction: 'click',
          eventLabel: 'Copy to clipboard'
        });
      }
    }
  };

  if (!document.queryCommandSupported('copy') && !document.queryCommandEnabled('copy')) {
    $('#toCopy').addClass('invisible');
  }

  $('#yaml2gengo').on('click', module.yaml2gengo);
  $('#gengo2yaml').on('click', module.gengo2yaml);
  $('#toGengo').on('click', module.send2Gengo);
  $('#toCopy').on('click', module.send2Clipboard);
  $('#insertGengo').on('click', module.insertGengo);
  $('#insertYAML').on('click', module.insertYAML);

  module.insertYAML();
});
