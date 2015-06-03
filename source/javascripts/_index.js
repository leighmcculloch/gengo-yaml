$(function(){
  $('textarea.yaml').change(function(){
    var yaml = jsyaml.load($(this).val());
    var json = JSON.stringify(yaml, null, 2);
    $('textarea.gengo').val(json);
  });
})