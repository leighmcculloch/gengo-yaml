var example = 
  'en:\n' +
  '  title: My Website\n' +
  '  description: A boring website on the internet, made by me.\n';

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
      gengo += '[[[' + key + ']]]' + '\n';
      gengo += yaml_flat[key] + '\n';
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
