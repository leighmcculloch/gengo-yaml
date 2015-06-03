$(function(){
  var onYamlEvent = function(){
    var yaml = jsyaml.load($(this).val());
    var yaml_flat = JSON.flatten(yaml);
    var gengo = ""; // = JSON.stringify(yaml_flat, null, 2);
    for (var key in yaml_flat) {
      gengo += "[[[" + key + "]]]" + "\n";
      gengo += yaml_flat[key] + "\n";
    }

    $('textarea.gengo').val(gengo);
  };

  $('textarea.yaml').keydown(onYamlEvent);
  $('textarea.yaml').keyup(onYamlEvent);
  $('textarea.yaml').change(onYamlEvent);
})