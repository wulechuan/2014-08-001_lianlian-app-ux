//定义字体大小
var charsCountPerLine = 24;
var minFontSizeInPixel = 14;
var maxFontSizeInPixel = 22;
decideFontSizeRem(charsCountPerLine, minFontSizeInPixel, maxFontSizeInPixel);

window.addEventListener('resize', function () {
    decideFontSizeRem(charsCountPerLine, minFontSizeInPixel, maxFontSizeInPixel);
});



function decideFontSizeRem(charsCountPerLine, minFontSizeInPixel, maxFontSizeInPixel, forceInteger) {
    var _domStyleId = 'wlc-style-root-font-size';
    var _safeValueCharsCountPerLine = 20; // 20 chars per line
    var _safeValueMinFontSizeInPixel = 12; // 12px
    var _safeValueMaxFontSizeInPixel = 20; // 18px
    var _forceInteger = (typeof forceInteger === 'undefined' || forceInteger == null) ? true : !!forceInteger;

    var _c = parseInt(charsCountPerLine) || _safeValueCharsCountPerLine;
    var _m1 = Number(minFontSizeInPixel) || _safeValueMinFontSizeInPixel;
    var _m2 = Number(maxFontSizeInPixel) || _safeValueMaxFontSizeInPixel;
    var _px = Math.min(
        _m2,
        Math.max(
            _m1,
            _forceInteger ? Math.floor(window.innerWidth / _c) : (window.innerWidth / _c)
        )
    );

    var log0 =   'window size: '　+ window.innerWidth　+   ' * '　+ window.innerHeight
            +　  '\nwhere devicePixelRatio is '　+ window.devicePixelRatio　+ '\n'
            +    'chars per line :' + _c + '       '　+ 'REM: ' + _px + 'px';

    //console.log(log0);
    //alert(log0);

    var _domStyle = document.getElementById(_domStyleId);
    if (!_domStyle) {
        _domStyle = document.createElement('style');
        _domStyle.id = _domStyleId;
        document.head.appendChild(_domStyle);   
    }

    _domStyle.innerHTML = 'html, body { font-size: ' + _px + 'px; }';
}

