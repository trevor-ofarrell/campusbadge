Badge.patterns.simple = () => {
  var n = 0;
  return [
    () => {
      var c = [127, 127, 127];
      NC.backlight(c.concat(c, c, c));
    },
    0
  ];
};
Badge.patterns.dim = () => {
  var n = 0;
  return [
    () => {
      var c = [31, 31, 31];
      NC.backlight(c.concat(c, c, c));
    },
    0
  ];
};
Badge.patterns.dimrainbow = () => {
  var n = 0;
  return [
    () => {
      n += 0.02;
      var b = 0.05;
      NC.backlight(
        E.HSBtoRGB(n, 1, b, 1).concat(
          E.HSBtoRGB(n + 0.1, 1, b, 1),
          E.HSBtoRGB(n + 0.2, 1, b, 1),
          E.HSBtoRGB(n + 0.3, 1, b, 1)
        )
      );
      NC.ledTop(E.HSBtoRGB(n + 0.4, 1, b, 1));
      NC.ledBottom(E.HSBtoRGB(n + 0.5, 1, b, 1));
    },
    200
  ];
};
Badge.patterns.rainbow = () => {
  var n = 0;
  return [
    () => {
      n += 0.01;
      NC.backlight(
        E.HSBtoRGB(n, 1, 1, 1).concat(
          E.HSBtoRGB(n + 0.1, 1, 1, 1),
          E.HSBtoRGB(n + 0.2, 1, 1, 1),
          E.HSBtoRGB(n + 0.3, 1, 1, 1)
        )
      );
      NC.ledTop(E.HSBtoRGB(n + 0.4, 1, 1, 1));
      NC.ledBottom(E.HSBtoRGB(n + 0.5, 1, 1, 1));
    },
    50
  ];
};
Badge.patterns.hues = () => {
  var hues = [0, 0.2, 0.4];
  return [
    () => {
      hues = hues.map(Math.random);
      var c = E.HSBtoRGB(hues[0], 1, 1, 1);
      NC.backlight(c.concat(c, c, c));
      NC.ledTop(E.HSBtoRGB(hues[1], 1, 1, 1));
      NC.ledBottom(E.HSBtoRGB(hues[2], 1, 1, 1));
    },
    500
  ];
};
Badge.patterns.rave = () => {
  var n = 0;
  return [
    () => {
      n += 0.01;
      var d = new Uint8Array(18);
      E.mapInPlace(d, d, x => Math.random() * 2048 - 1792);
      NC.ledBottom(d); // hack to send to *all* LEDs
    },
    50
  ];
};
Badge.patterns.lightning = () => {
  var n = 0;
  return [
    () => {
      var d = new Uint8Array(18);
      r = (0 | (50 * Math.random())) * 3;
      d.set([255, 255, 255], r); // will silently set out of bounds most of the time
      NC.ledBottom(d); // hack to send to *all* LEDs
    },
    20
  ];
};
Badge.patterns.red = () => {
  var n = 0;
  return [
    () => {
      n += 50;
      if (n > 1536) n = 0;
      NC.ledTop([0, 0, Math.max(255 - Math.abs(n - 1024), 0)]);
      NC.ledBottom([0, 0, Math.max(255 - Math.abs(n - 1384), 0)]);
      NC.backlight([
        0,
        0,
        Math.max(255 - Math.abs(n - 640), 0),
        0,
        0,
        Math.max(255 - Math.abs(n - 512), 0),
        0,
        0,
        Math.max(255 - Math.abs(n - 384), 0),
        0,
        0,
        Math.max(255 - Math.abs(n - 256), 0)
      ]);
    },
    50
  ];
};
Badge.patterns.info = () => {
  var n = 0;
  return [
    () => {
      n += 20;
      if (n > 3072) n = 0;
      var ca = Math.max(127 - Math.abs(n - 256), 0);
      var cb = Math.max(127 - Math.abs(n - 384), 0);
      var cl = 16 + 14 * Math.sin((n * Math.PI * 2) / 3072);
      NC.ledTop([cl, cl, cl]);
      NC.ledBottom([cl, cl, cl]);
      NC.backlight([cb, cb, cb, ca, ca, ca, ca, ca, ca, cb, cb, cb]);
    },
    50
  ];
};
// Actually display a pattern
Badge.pattern = name => {
  NC.ledTop();
  NC.ledBottom();
  NC.backlight();
  if (Badge._pattern) clearInterval(Badge._pattern);
  delete Badge._pattern;
  if (Badge.patterns[name]) {
    var p = Badge.patterns[name]();
    if (p[1]) Badge._pattern = setInterval(p[0], p[1]);
    p[0]();
  }
};
