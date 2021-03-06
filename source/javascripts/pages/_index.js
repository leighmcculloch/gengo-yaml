var example = 
  'en:\n' +
  '  title: My Website\n' +
  '  description: A %{website_type} website, made by <a href="http://example.com">me</a>.\n'

$(function(){
  var refreshYamlToGengo = function(){
    var yaml;
    try {
      yaml = jsyaml.load($('.yaml textarea').val());
    }
    catch(err) {
      console.log("Invalid YAML: " + err)
      return;
    }
    var yaml_flat = JSON.flatten(yaml);
    var gengo = '';
    for (var key in yaml_flat) {
      var value = yaml_flat[key];
      if (value == null) {
        value = ""
      }
      value = value.replace(/(%\{[a-z0-9_]+\})/ig, "[[[$1]]]")
      value = value.replace(/<([A-Z][A-Z0-9]*)(\b[^>]*)\/>/ig, "[[[<$1$2/>]]]")
      value = value.replace(/<([A-Z][A-Z0-9]*)(\b[^>]*)>(.*?)<\/\1>/ig, "[[[<$1$2>]]]$3[[[</$1>]]]")
      gengo += '[[[' + key + ']]]' + '\n';
      gengo += value + '\n';
    }

    $('.gengo textarea').val(gengo);
  };

  var refreshInterval = setInterval(refreshYamlToGengo, 100);
  $('.yaml textarea')
  .keydown(refreshYamlToGengo)
  .keyup(refreshYamlToGengo)
  .change(refreshYamlToGengo)
  .focus()
  .typed({
    strings: [example],
    typeSpeed: -100,
    contentType: 'text',
    showCursor: false,
    callback: function() {
      clearInterval(refreshInterval);
      refreshYamlToGengo();
    }
  });

  $('.actions .send-to-gengo').click(function() {
    var gengo = $('.gengo textarea').val();
    var $form = $(
      '<form action="https://gengo.com/order/receive_job_post/" name="translateForm" method="post" target="_blank">' +
      '<input type="hidden" name="referrer" value="order">' +
      '<input type="hidden" name="lc_src" value="en-US">' +
      '<input type="hidden" name="body_src" value="' + gengo.replace(/"/g, '&quot;') + '">' +
      '</form>'
    );
    $('body').append($form);
    $form.submit();
  });
});
