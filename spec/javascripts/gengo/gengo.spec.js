/*
 *= require vendor/_yaml.min
 *= require vendor/_jquery-2.1.4.min
 *= require modules/_gengo
 */
describe('Gengo Adapter', function () {
  var rawYAML = 'en:\n  title: My Website\n  description: A %{website_type} website, made by <a href="http://example.com">me</a>.\n'
  , rawGengoText = '[[[.en.title]]]\nMy Website\n[[[.en.description]]]\nA [[[%{website_type}]]] website, made by [[[<a href="http://example.com">]]]me[[[</a>]]].'
  , refObj = {"en":{"title":"My Website","description":"A %{website_type} website, made by <a href=\"http://example.com\">me</a>."}};

  describe('Method: stringify', function () {
    beforeEach(function () {
      this.parsed = YAML.parse(rawYAML);
    });

    it('Should return a string', function () {
      expect(Gengo.stringify(this.parsed)).toEqual(jasmine.any(String));
    });

    it('Should have key `en.title`', function () {
      expect(Gengo.stringify(this.parsed)).toMatch(/en\.title/);
    });

    it('Should wrap the html in triple square brackets', function () {
      var expected = '[[[<a href="http://example.com">me</a>]]]';
      expect(Gengo.stringify(this.parsed)).toMatch(expected);
    });

    it('Should wrap the interpolation variable in triple square brackets', function() {
      var expected = '[[[%{website_type}]]]';
      expect(Gengo.stringify(this.parsed)).toMatch(expected);
    });

    it('Should throw error if argument is not an object', function() {
      expect(function () { Gengo.stringify(rawYAML); }).toThrowError('Stringify requires a native object');
    });

    it('Should equal raw gengo text', function () {
      expect(Gengo.stringify(this.parsed)).toEqual(rawGengoText);
    });
  });

  describe('Method: parse', function () {
    it('Should return an object', function () {
      expect(Gengo.parse(rawGengoText)).toEqual(jasmine.any(Object));
    });

    it('Should return en.title', function () {
      expect(Gengo.parse(rawGengoText).en.title).toEqual('My Website');
    });

    it('Should be the same as the reference object', function () {
      expect(Gengo.parse(rawGengoText)).toEqual(refObj);
    });
  });
});
