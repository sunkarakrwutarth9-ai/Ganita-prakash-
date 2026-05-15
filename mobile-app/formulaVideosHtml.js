// In-app Formula Videos viewer. Self-contained: no network. Renders animated
// SVG illustrations + step-by-step derivations of the key Class 6 / Class 7
// NCERT math formulas. Same module shape as whiteboardHtml.js /
// fundamentalsHtml.js so it plugs into the existing WebView modal.

const FORMULAS_6 = [
  {
    id: 'sq_per',
    title: 'Perimeter of a Square',
    formula: 'P = 4 \u00d7 s',
    summary: 'Add up all four equal sides of a square to get its perimeter.',
    svg: '<svg viewBox="0 0 200 200"><rect class="sh" x="40" y="40" width="120" height="120" fill="none" stroke="#00e5ff" stroke-width="3"/>' +
         '<text class="lb" x="100" y="36" text-anchor="middle">s</text>' +
         '<text class="lb" x="100" y="178" text-anchor="middle">s</text>' +
         '<text class="lb" x="32" y="105" text-anchor="end">s</text>' +
         '<text class="lb" x="170" y="105" text-anchor="start">s</text></svg>',
    steps: [
      'A square has 4 equal sides, each of length s.',
      'Perimeter = sum of all sides = s + s + s + s.',
      'Group the addition: P = 4 \u00d7 s.',
      'Example: if s = 6 cm, P = 4 \u00d7 6 = 24 cm.'
    ]
  },
  {
    id: 'sq_area',
    title: 'Area of a Square',
    formula: 'A = s \u00d7 s = s\u00b2',
    summary: 'A square of side s fits s rows of s unit-squares inside it.',
    svg: '<svg viewBox="0 0 200 200">' +
         '<g stroke="#00e5ff" stroke-width="1" fill="rgba(0,229,255,0.12)">' +
         [0,1,2,3].map(function(r){ return [0,1,2,3].map(function(c){ return '<rect x="'+(40+c*30)+'" y="'+(40+r*30)+'" width="30" height="30"/>'; }).join(''); }).join('') +
         '</g>' +
         '<text class="lb" x="100" y="34" text-anchor="middle">s = 4 units</text>' +
         '<text class="lb" x="100" y="190" text-anchor="middle">Area = 4 \u00d7 4 = 16</text>' +
         '</svg>',
    steps: [
      'Imagine the square as a grid of unit squares.',
      'There are s rows and s columns, so s \u00d7 s small squares fit inside.',
      'Area = s \u00d7 s, written as s\u00b2.',
      'Example: side 5 m \u2192 area = 5\u00b2 = 25 m\u00b2.'
    ]
  },
  {
    id: 'rect_per',
    title: 'Perimeter of a Rectangle',
    formula: 'P = 2 (l + b)',
    summary: 'A rectangle has 2 lengths and 2 breadths, so add one of each and double it.',
    svg: '<svg viewBox="0 0 240 180">' +
         '<rect class="sh" x="30" y="40" width="180" height="100" fill="none" stroke="#00e5ff" stroke-width="3"/>' +
         '<text class="lb" x="120" y="34" text-anchor="middle">length l</text>' +
         '<text class="lb" x="120" y="158" text-anchor="middle">length l</text>' +
         '<text class="lb" x="22" y="93" text-anchor="end">b</text>' +
         '<text class="lb" x="218" y="93" text-anchor="start">b</text>' +
         '</svg>',
    steps: [
      'Opposite sides of a rectangle are equal.',
      'Perimeter = l + b + l + b.',
      'Group like terms: P = 2l + 2b = 2(l + b).',
      'Example: l = 8, b = 5 \u2192 P = 2(8+5) = 26 units.'
    ]
  },
  {
    id: 'rect_area',
    title: 'Area of a Rectangle',
    formula: 'A = l \u00d7 b',
    summary: 'Length \u00d7 breadth counts the unit squares that fit inside.',
    svg: '<svg viewBox="0 0 240 180">' +
         '<g stroke="#00e5ff" stroke-width="1" fill="rgba(0,229,255,0.12)">' +
         [0,1,2,3].map(function(r){ return [0,1,2,3,4,5].map(function(c){ return '<rect x="'+(30+c*30)+'" y="'+(40+r*25)+'" width="30" height="25"/>'; }).join(''); }).join('') +
         '</g>' +
         '<text class="lb" x="120" y="32" text-anchor="middle">l = 6</text>' +
         '<text class="lb" x="22" y="80" text-anchor="end">b = 4</text>' +
         '<text class="lb" x="120" y="160" text-anchor="middle">Area = 6 \u00d7 4 = 24</text>' +
         '</svg>',
    steps: [
      'Divide the rectangle into a grid of unit squares.',
      'It has b rows and l columns of unit squares.',
      'Total unit squares = l \u00d7 b.',
      'Example: l = 9 cm, b = 4 cm \u2192 A = 36 cm\u00b2.'
    ]
  },
  {
    id: 'tri_per',
    title: 'Perimeter of a Triangle',
    formula: 'P = a + b + c',
    summary: 'Just add the three side lengths together.',
    svg: '<svg viewBox="0 0 220 200">' +
         '<polygon class="sh" points="40,170 180,170 110,40" fill="none" stroke="#00e5ff" stroke-width="3"/>' +
         '<text class="lb" x="110" y="186" text-anchor="middle">a</text>' +
         '<text class="lb" x="60" y="100" text-anchor="end">b</text>' +
         '<text class="lb" x="160" y="100" text-anchor="start">c</text>' +
         '</svg>',
    steps: [
      'A triangle has three sides: a, b, c.',
      'Perimeter is the total boundary length.',
      'So P = a + b + c.',
      'Example: sides 3, 4, 5 \u2192 P = 12 units.'
    ]
  },
  {
    id: 'cube_vol',
    title: 'Volume of a Cube',
    formula: 'V = s \u00d7 s \u00d7 s = s\u00b3',
    summary: 'A cube of side s fits s\u00b3 unit cubes inside it.',
    svg: '<svg viewBox="0 0 220 200">' +
         '<polygon class="sh" points="50,150 50,60 130,30 210,60 210,150 130,180" fill="rgba(0,229,255,0.10)" stroke="#00e5ff" stroke-width="3"/>' +
         '<polyline class="sh" points="50,60 130,90 130,180" fill="none" stroke="#00e5ff" stroke-width="3"/>' +
         '<polyline class="sh" points="130,90 210,60" fill="none" stroke="#00e5ff" stroke-width="3"/>' +
         '<text class="lb" x="20" y="115" text-anchor="middle">s</text>' +
         '<text class="lb" x="170" y="170" text-anchor="middle">s</text>' +
         '<text class="lb" x="170" y="45" text-anchor="middle">s</text>' +
         '</svg>',
    steps: [
      'A cube has all three dimensions equal: length = breadth = height = s.',
      'Volume = length \u00d7 breadth \u00d7 height.',
      'So V = s \u00d7 s \u00d7 s = s\u00b3.',
      'Example: s = 4 cm \u2192 V = 4\u00b3 = 64 cm\u00b3.'
    ]
  },
  {
    id: 'cuboid_vol',
    title: 'Volume of a Cuboid',
    formula: 'V = l \u00d7 b \u00d7 h',
    summary: 'Multiply the three different edge lengths.',
    svg: '<svg viewBox="0 0 240 200">' +
         '<polygon class="sh" points="40,150 40,70 130,40 220,70 220,150 130,180" fill="rgba(0,229,255,0.10)" stroke="#00e5ff" stroke-width="3"/>' +
         '<polyline class="sh" points="40,70 130,100 130,180" fill="none" stroke="#00e5ff" stroke-width="3"/>' +
         '<polyline class="sh" points="130,100 220,70" fill="none" stroke="#00e5ff" stroke-width="3"/>' +
         '<text class="lb" x="22" y="125" text-anchor="middle">h</text>' +
         '<text class="lb" x="180" y="175" text-anchor="middle">l</text>' +
         '<text class="lb" x="180" y="55" text-anchor="middle">b</text>' +
         '</svg>',
    steps: [
      'A cuboid (rectangular box) has length l, breadth b, height h.',
      'Imagine slicing it into l\u00d7b unit-square base, h units tall.',
      'Each layer has l\u00d7b unit cubes, and there are h layers.',
      'Volume = l \u00d7 b \u00d7 h. Example 5\u00d73\u00d72 = 30 unit\u00b3.'
    ]
  },
  {
    id: 'frac_add',
    title: 'Adding Fractions (Same Denominator)',
    formula: 'a/c + b/c = (a + b)/c',
    summary: 'Same denominator? Just add the numerators.',
    svg: '<svg viewBox="0 0 240 160">' +
         '<g stroke="#00e5ff" stroke-width="2" fill="none">' +
         '<rect x="20" y="40" width="80" height="40"/>' +
         '<line x1="40" y1="40" x2="40" y2="80"/><line x1="60" y1="40" x2="60" y2="80"/><line x1="80" y1="40" x2="80" y2="80"/>' +
         '<rect x="20" y="40" width="40" height="40" fill="#00e5ff" fill-opacity="0.35" stroke="none"/>' +
         '</g>' +
         '<text class="lb" x="60" y="105" text-anchor="middle">2/4</text>' +
         '<text class="lb" x="120" y="65" text-anchor="middle">+</text>' +
         '<g stroke="#00e5ff" stroke-width="2" fill="none">' +
         '<rect x="140" y="40" width="80" height="40"/>' +
         '<line x1="160" y1="40" x2="160" y2="80"/><line x1="180" y1="40" x2="180" y2="80"/><line x1="200" y1="40" x2="200" y2="80"/>' +
         '<rect x="140" y="40" width="20" height="40" fill="#00e5ff" fill-opacity="0.35" stroke="none"/>' +
         '</g>' +
         '<text class="lb" x="180" y="105" text-anchor="middle">1/4</text>' +
         '<text class="lb" x="120" y="135" text-anchor="middle">= 3/4</text>' +
         '</svg>',
    steps: [
      'Both fractions share the same whole, cut into c equal parts.',
      'a/c means a of those c parts; b/c means b more of them.',
      'Together, a + b parts out of c \u2192 (a+b)/c.',
      'Example: 2/4 + 1/4 = 3/4.'
    ]
  },
  {
    id: 'frac_mul',
    title: 'Multiplying Fractions',
    formula: '(a/b) \u00d7 (c/d) = (a \u00d7 c)/(b \u00d7 d)',
    summary: 'Multiply numerators on top, denominators on bottom.',
    svg: '<svg viewBox="0 0 240 160">' +
         '<g stroke="#00e5ff" stroke-width="2" fill="none">' +
         '<rect x="40" y="30" width="120" height="80"/>' +
         '<line x1="80" y1="30" x2="80" y2="110"/><line x1="120" y1="30" x2="120" y2="110"/>' +
         '<line x1="40" y1="50" x2="160" y2="50"/><line x1="40" y1="70" x2="160" y2="70"/><line x1="40" y1="90" x2="160" y2="90"/>' +
         '<rect x="40" y="30" width="80" height="20" fill="#00e5ff" fill-opacity="0.35" stroke="none"/>' +
         '<rect x="40" y="30" width="80" height="40" fill="#00e5ff" fill-opacity="0.15" stroke="none"/>' +
         '</g>' +
         '<text class="lb" x="100" y="135" text-anchor="middle">2/3 \u00d7 1/2 = 2/6 = 1/3</text>' +
         '</svg>',
    steps: [
      'Multiplying fractions = taking a fraction OF a fraction.',
      'Cut the rectangle into b columns, shade a of them (a/b).',
      'Cut it again into d rows, shade c of them (c/d).',
      'Overlap = (a\u00d7c) small parts out of (b\u00d7d) total \u2192 ac/bd.'
    ]
  },
  {
    id: 'avg',
    title: 'Average (Mean)',
    formula: 'Mean = (sum of values) / (number of values)',
    summary: 'Total everything, then split it equally.',
    svg: '<svg viewBox="0 0 240 160">' +
         '<g stroke="#00e5ff" stroke-width="2" fill="rgba(0,229,255,0.18)">' +
         '<rect x="20" y="120" width="30" height="30"/>' +
         '<rect x="60" y="80" width="30" height="70"/>' +
         '<rect x="100" y="60" width="30" height="90"/>' +
         '<rect x="140" y="100" width="30" height="50"/>' +
         '<rect x="180" y="40" width="30" height="110"/>' +
         '</g>' +
         '<line x1="20" y1="90" x2="210" y2="90" stroke="#ff7a00" stroke-width="2" stroke-dasharray="4 3"/>' +
         '<text class="lb" x="115" y="32" text-anchor="middle">mean line</text>' +
         '</svg>',
    steps: [
      'Add up every value.',
      'Count how many values you added.',
      'Divide the total by the count.',
      'Example: marks 8, 6, 10, 4, 12 \u2192 sum 40, count 5 \u2192 mean 8.'
    ]
  },
  {
    id: 'ratio',
    title: 'Ratio',
    formula: 'a : b = a / b',
    summary: 'A ratio compares two quantities by division.',
    svg: '<svg viewBox="0 0 240 140">' +
         '<g fill="#00e5ff" fill-opacity="0.7">' +
         '<rect x="20" y="40" width="30" height="40"/><rect x="55" y="40" width="30" height="40"/><rect x="90" y="40" width="30" height="40"/>' +
         '</g>' +
         '<g fill="#ff7a00" fill-opacity="0.7">' +
         '<rect x="150" y="40" width="30" height="40"/><rect x="185" y="40" width="30" height="40"/>' +
         '</g>' +
         '<text class="lb" x="70" y="105" text-anchor="middle">3 boys</text>' +
         '<text class="lb" x="180" y="105" text-anchor="middle">2 girls</text>' +
         '<text class="lb" x="120" y="130" text-anchor="middle">ratio = 3 : 2</text>' +
         '</svg>',
    steps: [
      'Ratio compares two quantities of the same kind.',
      'Write as a : b or as the fraction a/b.',
      'Simplify by dividing both by their HCF.',
      'Example: 15 boys to 10 girls = 15:10 = 3:2.'
    ]
  },
  {
    id: 'expr',
    title: 'Algebraic Expression Value',
    formula: 'value = substitute & simplify',
    summary: 'Replace the letter with a number, then evaluate.',
    svg: '<svg viewBox="0 0 240 140">' +
         '<text x="120" y="60" text-anchor="middle" fill="#00e5ff" font-size="28" font-family="serif">3x + 5</text>' +
         '<text x="120" y="92" text-anchor="middle" fill="#aaa" font-size="14">when x = 4</text>' +
         '<text x="120" y="120" text-anchor="middle" fill="#34c759" font-size="20" font-family="serif">3(4) + 5 = 17</text>' +
         '</svg>',
    steps: [
      'An expression like 3x + 5 has a letter that stands for a number.',
      'Substitute the given value of x.',
      'Follow the order of operations: \u00d7 before +.',
      'Example: x = 4 \u2192 3\u00d74 + 5 = 12 + 5 = 17.'
    ]
  }
];

const FORMULAS_7 = [
  {
    id: 'int_add',
    title: 'Adding Integers',
    formula: 'Same signs \u2192 add; different signs \u2192 subtract (keep larger sign)',
    summary: 'Use the number line: positive moves right, negative moves left.',
    svg: '<svg viewBox="0 0 260 120">' +
         '<line x1="10" y1="60" x2="250" y2="60" stroke="#00e5ff" stroke-width="2"/>' +
         [-5,-4,-3,-2,-1,0,1,2,3,4,5].map(function(n,i){ var x=10+i*24; return '<line x1="'+x+'" y1="55" x2="'+x+'" y2="65" stroke="#00e5ff" stroke-width="2"/><text class="lb" x="'+x+'" y="82" text-anchor="middle" font-size="11">'+n+'</text>'; }).join('') +
         '<path d="M58,38 Q130,8 178,38" fill="none" stroke="#ff7a00" stroke-width="2" marker-end="url(#a)"/>' +
         '<defs><marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ff7a00"/></marker></defs>' +
         '<text class="lb" x="118" y="30" text-anchor="middle">-3 + 7 = 4</text>' +
         '</svg>',
    steps: [
      'On the number line, start at the first integer.',
      'Move right by the magnitude of a positive number, left for negative.',
      'Same sign: add the magnitudes, keep the sign.',
      'Different signs: subtract smaller magnitude from larger, keep larger sign.'
    ]
  },
  {
    id: 'int_mul',
    title: 'Multiplying Integers',
    formula: '(+)(+) = +,  (\u2212)(\u2212) = +,  (+)(\u2212) = \u2212',
    summary: 'Same signs give positive, different signs give negative.',
    svg: '<svg viewBox="0 0 240 160">' +
         '<text x="60" y="60" text-anchor="middle" fill="#34c759" font-size="22" font-family="serif">(+)(+) = +</text>' +
         '<text x="180" y="60" text-anchor="middle" fill="#34c759" font-size="22" font-family="serif">(\u2212)(\u2212) = +</text>' +
         '<text x="60" y="110" text-anchor="middle" fill="#ff3b30" font-size="22" font-family="serif">(+)(\u2212) = \u2212</text>' +
         '<text x="180" y="110" text-anchor="middle" fill="#ff3b30" font-size="22" font-family="serif">(\u2212)(+) = \u2212</text>' +
         '<text x="120" y="148" text-anchor="middle" class="lb">same \u2192 +, different \u2192 \u2212</text>' +
         '</svg>',
    steps: [
      'Count the negative signs.',
      'Even number of negatives \u2192 product is positive.',
      'Odd number of negatives \u2192 product is negative.',
      'Example: (\u22123)\u00d7(\u22124) = +12;  (\u22125)\u00d7(2) = \u221210.'
    ]
  },
  {
    id: 'tri_angle',
    title: 'Triangle Angle Sum',
    formula: '\u2220A + \u2220B + \u2220C = 180\u00b0',
    summary: 'The three angles of any triangle always add to 180\u00b0.',
    svg: '<svg viewBox="0 0 240 180">' +
         '<polygon class="sh" points="30,160 210,160 110,30" fill="rgba(0,229,255,0.10)" stroke="#00e5ff" stroke-width="3"/>' +
         '<path d="M50,160 A20,20 0 0,0 60,148" fill="none" stroke="#ff7a00" stroke-width="2"/>' +
         '<path d="M190,160 A20,20 0 0,1 180,148" fill="none" stroke="#ff7a00" stroke-width="2"/>' +
         '<path d="M104,50 A18,18 0 0,1 122,52" fill="none" stroke="#ff7a00" stroke-width="2"/>' +
         '<text class="lb" x="56" y="146" text-anchor="middle">A</text>' +
         '<text class="lb" x="184" y="146" text-anchor="middle">B</text>' +
         '<text class="lb" x="110" y="70" text-anchor="middle">C</text>' +
         '</svg>',
    steps: [
      'Tear off the three corners of any triangle.',
      'Place them next to each other along a straight line.',
      'The three angles together fill a straight line = 180\u00b0.',
      'So if two angles are 50\u00b0 and 60\u00b0, the third = 180 \u2212 110 = 70\u00b0.'
    ]
  },
  {
    id: 'ext_ang',
    title: 'Exterior Angle of a Triangle',
    formula: 'ext \u2220 = sum of the two opposite interior \u2220s',
    summary: 'Extend one side: that outside angle equals the two far inside angles added.',
    svg: '<svg viewBox="0 0 260 180">' +
         '<polygon class="sh" points="40,150 180,150 120,40" fill="rgba(0,229,255,0.10)" stroke="#00e5ff" stroke-width="3"/>' +
         '<line x1="180" y1="150" x2="240" y2="150" stroke="#00e5ff" stroke-width="3"/>' +
         '<text class="lb" x="60" y="140" text-anchor="middle">A</text>' +
         '<text class="lb" x="120" y="60" text-anchor="middle">B</text>' +
         '<text class="lb" x="175" y="170" text-anchor="end">C</text>' +
         '<text class="lb" x="210" y="140" text-anchor="middle" fill="#ff7a00">ext</text>' +
         '</svg>',
    steps: [
      'Inside angles add to 180\u00b0 (triangle sum).',
      'Angle C + exterior angle also = 180\u00b0 (straight line).',
      'Subtract: exterior angle = 180 \u2212 C = A + B.',
      'So exterior angle = sum of the two opposite interior angles.'
    ]
  },
  {
    id: 'cir_per',
    title: 'Circumference of a Circle',
    formula: 'C = 2\u03c0r = \u03c0d',
    summary: 'Multiply the diameter by \u03c0 to get the distance around the circle.',
    svg: '<svg viewBox="0 0 220 180">' +
         '<circle class="sh" cx="110" cy="90" r="70" fill="none" stroke="#00e5ff" stroke-width="3"/>' +
         '<line x1="40" y1="90" x2="180" y2="90" stroke="#ff7a00" stroke-width="2" stroke-dasharray="4 3"/>' +
         '<circle cx="110" cy="90" r="3" fill="#fff"/>' +
         '<text class="lb" x="110" y="106" text-anchor="middle">r</text>' +
         '<text class="lb" x="110" y="30" text-anchor="middle">d = 2r</text>' +
         '</svg>',
    steps: [
      'Wrap a string around the circle.',
      'Unroll the string: its length is the circumference C.',
      'For every circle, C / d is the same constant: \u03c0 \u2248 3.14159.',
      'So C = \u03c0 \u00d7 d = 2\u03c0r. Example r = 7 \u2192 C \u2248 44 units (use \u03c0 \u2248 22/7).'
    ]
  },
  {
    id: 'cir_area',
    title: 'Area of a Circle',
    formula: 'A = \u03c0 r\u00b2',
    summary: '\u03c0 times the square of the radius.',
    svg: '<svg viewBox="0 0 220 180">' +
         '<circle class="sh" cx="110" cy="90" r="70" fill="rgba(0,229,255,0.18)" stroke="#00e5ff" stroke-width="3"/>' +
         '<line x1="110" y1="90" x2="180" y2="90" stroke="#ff7a00" stroke-width="2"/>' +
         '<circle cx="110" cy="90" r="3" fill="#fff"/>' +
         '<text class="lb" x="145" y="84" text-anchor="middle">r</text>' +
         '<text class="lb" x="110" y="30" text-anchor="middle">A = \u03c0 r\u00b2</text>' +
         '</svg>',
    steps: [
      'Cut the circle into many thin pie slices.',
      'Rearrange the slices into an almost-rectangle.',
      'Width \u2248 r, length \u2248 half the circumference = \u03c0r.',
      'Area \u2248 r \u00d7 \u03c0r = \u03c0r\u00b2. Example r = 7 \u2192 A \u2248 154 sq units.'
    ]
  },
  {
    id: 'paral',
    title: 'Area of a Parallelogram',
    formula: 'A = base \u00d7 height',
    summary: 'Slice the slanted edge and slide it: it becomes a rectangle.',
    svg: '<svg viewBox="0 0 240 160">' +
         '<polygon class="sh" points="40,120 180,120 210,40 70,40" fill="rgba(0,229,255,0.18)" stroke="#00e5ff" stroke-width="3"/>' +
         '<line x1="70" y1="40" x2="70" y2="120" stroke="#ff7a00" stroke-width="2" stroke-dasharray="4 3"/>' +
         '<text class="lb" x="110" y="138" text-anchor="middle">base</text>' +
         '<text class="lb" x="58" y="82" text-anchor="end">h</text>' +
         '</svg>',
    steps: [
      'Drop a perpendicular from one top vertex to the base (height h).',
      'Cut the right-triangle piece and slide it to the other side.',
      'The shape becomes a rectangle with sides base and h.',
      'Area = base \u00d7 height.'
    ]
  },
  {
    id: 'tri_area',
    title: 'Area of a Triangle',
    formula: 'A = \u00bd \u00d7 base \u00d7 height',
    summary: 'A triangle is half a parallelogram with the same base and height.',
    svg: '<svg viewBox="0 0 240 160">' +
         '<polygon class="sh" points="40,130 200,130 80,40" fill="rgba(0,229,255,0.18)" stroke="#00e5ff" stroke-width="3"/>' +
         '<polygon class="sh" points="40,130 80,40 240,40 200,130" fill="rgba(0,229,255,0.06)" stroke="#00e5ff" stroke-width="2" stroke-dasharray="4 3"/>' +
         '<text class="lb" x="120" y="148" text-anchor="middle">base</text>' +
         '<text class="lb" x="60" y="85" text-anchor="end">h</text>' +
         '</svg>',
    steps: [
      'Take a triangle with base b and height h.',
      'Make a copy, flip it, and join to form a parallelogram (base b, height h).',
      'Parallelogram area = b \u00d7 h.',
      'Triangle is half of it: A = \u00bd \u00d7 b \u00d7 h.'
    ]
  },
  {
    id: 'percent',
    title: 'Percentage',
    formula: 'percent = (part / whole) \u00d7 100%',
    summary: 'Convert a fraction to per-hundred form by multiplying by 100.',
    svg: '<svg viewBox="0 0 240 140">' +
         '<g stroke="#00e5ff" stroke-width="2" fill="none">' +
         [0,1,2,3,4,5,6,7,8,9].map(function(c){ return [0,1,2,3,4,5,6,7,8,9].map(function(r){ var f = (r*10+c) < 30 ? '#00e5ff' : 'transparent'; return '<rect x="'+(20+c*20)+'" y="'+(10+r*10)+'" width="20" height="10" fill="'+f+'" fill-opacity="0.5"/>';}).join(''); }).join('') +
         '</g>' +
         '<text class="lb" x="120" y="128" text-anchor="middle">30 out of 100 = 30%</text>' +
         '</svg>',
    steps: [
      'A percent means "per 100".',
      'Express the part as a fraction of the whole.',
      'Multiply by 100 to get the percent.',
      'Example: 18 marks out of 25 \u2192 (18/25)\u00d7100 = 72%.'
    ]
  },
  {
    id: 'profit',
    title: 'Profit, Loss & Their Percentages',
    formula: 'P% = (Profit / CP) \u00d7 100,  L% = (Loss / CP) \u00d7 100',
    summary: 'Always compare profit or loss to the COST PRICE.',
    svg: '<svg viewBox="0 0 240 140">' +
         '<rect x="20" y="40" width="80" height="60" fill="rgba(0,229,255,0.18)" stroke="#00e5ff" stroke-width="2"/>' +
         '<rect x="140" y="20" width="80" height="80" fill="rgba(52,199,89,0.25)" stroke="#34c759" stroke-width="2"/>' +
         '<text class="lb" x="60" y="120" text-anchor="middle">CP \u20b9100</text>' +
         '<text class="lb" x="180" y="120" text-anchor="middle">SP \u20b9120</text>' +
         '<text class="lb" x="120" y="80" text-anchor="middle">Profit \u20b920</text>' +
         '</svg>',
    steps: [
      'If SP (selling price) > CP (cost price), Profit = SP \u2212 CP.',
      'If SP < CP, Loss = CP \u2212 SP.',
      'Percent is always taken on CP, not SP.',
      'Example: CP \u20b9100, SP \u20b9120 \u2192 Profit \u20b920, P% = 20%.'
    ]
  },
  {
    id: 'si',
    title: 'Simple Interest',
    formula: 'SI = (P \u00d7 R \u00d7 T) / 100',
    summary: 'P = principal (\u20b9), R = rate per year (%), T = time (years).',
    svg: '<svg viewBox="0 0 240 140">' +
         '<text x="120" y="50" text-anchor="middle" fill="#00e5ff" font-size="22" font-family="serif">SI = PRT \u2215 100</text>' +
         '<text x="120" y="78" text-anchor="middle" class="lb">P = \u20b91000, R = 5%, T = 3 yr</text>' +
         '<text x="120" y="110" text-anchor="middle" fill="#34c759" font-size="18" font-family="serif">SI = 1000\u00d75\u00d73\u2215100 = \u20b9150</text>' +
         '</svg>',
    steps: [
      'Interest grows in equal yearly chunks: P \u00d7 R% each year.',
      'For T years that becomes P \u00d7 R \u00d7 T \u00f7 100 (R is a percent).',
      'Amount = P + SI is the total to repay.',
      'Example: \u20b91000 at 5% for 3 yr \u2192 SI = \u20b9150, Amount = \u20b91150.'
    ]
  },
  {
    id: 'exp_law',
    title: 'Laws of Exponents',
    formula: 'a^m \u00d7 a^n = a^(m+n);  a^m \u00f7 a^n = a^(m\u2212n);  (a^m)^n = a^(mn)',
    summary: 'Same base: add exponents to multiply, subtract to divide.',
    svg: '<svg viewBox="0 0 240 140">' +
         '<text x="120" y="50" text-anchor="middle" fill="#00e5ff" font-size="22" font-family="serif">2\u00b3 \u00d7 2\u00b2 = 2^5 = 32</text>' +
         '<text x="120" y="86" text-anchor="middle" fill="#00e5ff" font-size="22" font-family="serif">2^5 \u00f7 2\u00b2 = 2\u00b3 = 8</text>' +
         '<text x="120" y="122" text-anchor="middle" fill="#00e5ff" font-size="22" font-family="serif">(2\u00b2)\u00b3 = 2^6 = 64</text>' +
         '</svg>',
    steps: [
      'Multiplying same base \u2192 keep base, add exponents (count the factors).',
      'Dividing same base \u2192 subtract exponents.',
      'Power of a power \u2192 multiply exponents.',
      'Anything (\u22600) to the 0 = 1; a^1 = a.'
    ]
  },
  {
    id: 'lin_eq',
    title: 'Solving a Linear Equation',
    formula: 'isolate x: do the same thing to both sides',
    summary: 'Whatever you do to one side, do to the other to keep balance.',
    svg: '<svg viewBox="0 0 260 160">' +
         '<text x="130" y="50" text-anchor="middle" fill="#00e5ff" font-size="22" font-family="serif">3x + 5 = 20</text>' +
         '<text x="130" y="82" text-anchor="middle" class="lb">subtract 5 both sides</text>' +
         '<text x="130" y="110" text-anchor="middle" fill="#00e5ff" font-size="22" font-family="serif">3x = 15</text>' +
         '<text x="130" y="142" text-anchor="middle" fill="#34c759" font-size="22" font-family="serif">x = 5</text>' +
         '</svg>',
    steps: [
      'Goal: get x alone on one side.',
      'Undo addition with subtraction (and vice versa) on both sides.',
      'Undo multiplication with division on both sides.',
      'Example: 3x + 5 = 20 \u2192 3x = 15 \u2192 x = 5.'
    ]
  },
  {
    id: 'rational',
    title: 'Rational Numbers',
    formula: 'p / q where p, q are integers and q \u2260 0',
    summary: 'Any number you can write as a fraction of integers (denominator non-zero).',
    svg: '<svg viewBox="0 0 240 140">' +
         '<line x1="20" y1="80" x2="220" y2="80" stroke="#00e5ff" stroke-width="2"/>' +
         [-2,-1,0,1,2].map(function(n,i){ var x=20+i*50; return '<line x1="'+x+'" y1="74" x2="'+x+'" y2="86" stroke="#00e5ff" stroke-width="2"/><text class="lb" x="'+x+'" y="105" text-anchor="middle" font-size="13">'+n+'</text>'; }).join('') +
         '<circle cx="95" cy="80" r="4" fill="#ff7a00"/><text class="lb" x="95" y="56" text-anchor="middle" fill="#ff7a00">\u2212\u00bd</text>' +
         '<circle cx="170" cy="80" r="4" fill="#34c759"/><text class="lb" x="170" y="56" text-anchor="middle" fill="#34c759">3\u20442</text>' +
         '</svg>',
    steps: [
      'Rational numbers include integers, fractions, and finite/repeating decimals.',
      'They can always be written as p/q with q \u2260 0.',
      'Add / subtract by taking common denominators.',
      'Multiply: numerators \u00d7 numerators, denominators \u00d7 denominators.'
    ]
  }
];

function buildFormulaVideosHtml(cls) {
  const data6 = FORMULAS_6;
  const data7 = FORMULAS_7;
  const active = String(cls) === '7' ? '7' : '6';
  const payload = JSON.stringify({ c6: data6, c7: data7, active: active })
    .replace(/<\/script>/gi, '<\\/script>');
  return `<!DOCTYPE html>
<html><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<title>Formula Videos</title>
<style>
*,*:before,*:after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body{margin:0;padding:0;background:#05070D;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased;}
.hdr{padding:14px 18px;background:linear-gradient(135deg,#1a1a3e 0%,#0d2137 100%);border-bottom:2px solid #00e5ff;display:flex;align-items:center;gap:12px;}
.hdr h1{margin:0;font-size:17px;color:#00e5ff;letter-spacing:1px;flex:1;}
.tabs{display:flex;background:#0d1430;border-bottom:1px solid #1a234a;}
.tab{flex:1;padding:12px;text-align:center;font-size:13px;font-weight:700;color:#9aa1c3;cursor:pointer;border-bottom:3px solid transparent;}
.tab.active{color:#00e5ff;border-bottom-color:#00e5ff;background:rgba(0,229,255,0.06);}
.list{padding:12px;display:grid;grid-template-columns:1fr;gap:12px;}
@media (min-width:560px){.list{grid-template-columns:1fr 1fr;}}
.card{background:#0f1530;border:1px solid #1f2a52;border-radius:14px;padding:14px;cursor:pointer;transition:transform .15s,border-color .15s;}
.card:active{transform:scale(.98);border-color:#00e5ff;}
.card h3{margin:0 0 4px;font-size:14.5px;color:#fff;}
.card p{margin:0;color:#9aa1c3;font-size:12.5px;line-height:1.4;}
.card .fm{display:inline-block;margin-top:8px;background:rgba(0,229,255,0.12);color:#00e5ff;border:1px solid #00e5ff40;border-radius:6px;padding:3px 8px;font-size:11.5px;font-family:"SF Mono",Menlo,monospace;}
.detail{padding:16px;}
.back{background:#0f1530;color:#00e5ff;border:1px solid #1f2a52;border-radius:8px;padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;}
.detail h2{margin:14px 0 4px;color:#00e5ff;font-size:20px;}
.detail .sub{margin:0 0 10px;color:#aaa;font-size:13px;}
.svgwrap{background:radial-gradient(circle at center,#0d1430 0%,#070a1d 100%);border:1px solid #1f2a52;border-radius:14px;padding:18px;margin:14px 0;}
.svgwrap svg{width:100%;height:auto;max-height:260px;display:block;}
.svgwrap text.lb{fill:#dfe5ff;font-size:13px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}
.svgwrap .sh{transition:stroke-dashoffset 1s ease,opacity .6s ease;}
.fbig{background:#0f1530;border:1px solid #00e5ff40;border-radius:12px;padding:14px;margin:10px 0;text-align:center;color:#00e5ff;font-size:18px;font-family:"SF Mono",Menlo,monospace;}
.steps{counter-reset:step;}
.step{position:relative;background:#0f1530;border:1px solid #1f2a52;border-radius:10px;padding:12px 14px 12px 46px;margin:8px 0;font-size:13.5px;line-height:1.55;color:#dfe5ff;opacity:.0;transform:translateY(8px);transition:opacity .5s ease,transform .5s ease;}
.step.on{opacity:1;transform:translateY(0);}
.step:before{counter-increment:step;content:counter(step);position:absolute;left:10px;top:10px;width:26px;height:26px;border-radius:50%;background:#00e5ff;color:#000;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:13px;}
.ctrls{display:flex;gap:8px;margin-top:14px;}
.ctrls button{flex:1;background:linear-gradient(135deg,#00d4ff,#0099ff);color:#fff;border:none;border-radius:10px;padding:12px;font-weight:700;font-size:14px;cursor:pointer;}
.ctrls button.alt{background:#0f1530;color:#00e5ff;border:1px solid #00e5ff40;}
.hidden{display:none;}
</style></head>
<body>
<div id="root"></div>
<script>
const DATA = ${payload};
let state = { view: 'list', cls: DATA.active, current: null, stepIdx: 0, timer: null };

function el(html){ const d=document.createElement('div'); d.innerHTML=html; return d.firstElementChild; }
function renderList(){
  const items = state.cls === '7' ? DATA.c7 : DATA.c6;
  const cards = items.map(f =>
    '<div class="card" data-id="'+f.id+'">' +
      '<h3>'+escapeHtml(f.title)+'</h3>' +
      '<p>'+escapeHtml(f.summary)+'</p>' +
      '<span class="fm">'+escapeHtml(f.formula)+'</span>' +
    '</div>'
  ).join('');
  const html =
    '<div class="hdr"><h1>Formula Videos \u2014 Class '+state.cls+'</h1></div>' +
    '<div class="tabs"><div class="tab'+(state.cls==='6'?' active':'')+'" data-cls="6">Class 6</div>' +
    '<div class="tab'+(state.cls==='7'?' active':'')+'" data-cls="7">Class 7</div></div>' +
    '<div class="list">'+cards+'</div>';
  document.getElementById('root').innerHTML = html;
  document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{ state.cls = t.dataset.cls; renderList(); });
  document.querySelectorAll('.card').forEach(c=>c.onclick=()=>openDetail(c.dataset.id));
}

function openDetail(id){
  const items = state.cls === '7' ? DATA.c7 : DATA.c6;
  const f = items.find(x => x.id === id);
  if (!f) return;
  state.view = 'detail'; state.current = f; state.stepIdx = -1;
  const stepsHtml = f.steps.map((s,i)=>'<div class="step" data-i="'+i+'">'+escapeHtml(s)+'</div>').join('');
  const html =
    '<div class="hdr"><button class="back" id="back">\u2190 Back</button><h1 style="font-size:15px;">'+escapeHtml(f.title)+'</h1></div>' +
    '<div class="detail">' +
      '<h2>'+escapeHtml(f.title)+'</h2>' +
      '<p class="sub">'+escapeHtml(f.summary)+'</p>' +
      '<div class="svgwrap">'+f.svg+'</div>' +
      '<div class="fbig">'+escapeHtml(f.formula)+'</div>' +
      '<div class="steps" id="steps">'+stepsHtml+'</div>' +
      '<div class="ctrls">' +
        '<button id="replay" class="alt">\u21BB Replay</button>' +
        '<button id="next">Next Step \u25B6</button>' +
      '</div>' +
    '</div>';
  document.getElementById('root').innerHTML = html;
  document.getElementById('back').onclick = ()=>{ stopPlay(); state.view='list'; state.current=null; renderList(); };
  document.getElementById('replay').onclick = playSteps;
  document.getElementById('next').onclick = nextStep;
  playSteps();
}

function nextStep(){
  if (!state.current) return;
  const all = document.querySelectorAll('.step');
  state.stepIdx = Math.min(state.stepIdx + 1, all.length - 1);
  all.forEach((node, i) => { node.classList.toggle('on', i <= state.stepIdx); });
}

function playSteps(){
  if (state.timer) { clearInterval(state.timer); state.timer = null; }
  const all = document.querySelectorAll('.step');
  state.stepIdx = -1;
  all.forEach(n => n.classList.remove('on'));
  state.timer = setInterval(()=>{
    state.stepIdx++;
    if (state.stepIdx >= all.length) { clearInterval(state.timer); state.timer=null; return; }
    all[state.stepIdx].classList.add('on');
  }, 1500);
}

function stopPlay(){ if (state.timer) { clearInterval(state.timer); state.timer=null; } }

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; });
}

renderList();
</script>
</body></html>`;
}

module.exports = { buildFormulaVideosHtml };
