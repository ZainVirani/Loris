import moment from 'moment';

module.exports = {
  eq(a, b) {
    return a === b;
  },
  neq(a, b) {
    return a !== b;
  },
  gt(a, b) {
    return a > b;
  },
  lt(a, b) {
    return a < b;
  },
  geq(a, b) {
    return a >= b;
  },
  leq(a, b) {
    return a <= b;
  },
  add(a, b) {
    return a + b;
  },
  sub(a, b) {
    return a - b;
  },
  mul(a, b) {
    return a * b;
  },
  div(a, b) {
    return a / b;
  },
  pow(a, b) {
    return Math.pow(a, b);
  },
  mod(a, b) {
    return a % b;
  },
  negate(a) {
    return -a;
  },
  per(a) {
    return a / 100;
  },
  and(a, b) {
    if (a && b) {
      return true;
    } else {
      return false;
    }
  },
  or(a, b) {
    if (a || b) {
      return true;
    } else {
      return false;
    }
  },
  not(a) {
    return !a;
  },
  fact(a) {
    if (a >= 0 && a%1 == 0) {
      return (function fact (n) { return n==0 ? 1 : fact(n-1) * n })(a);
    } else if (a >= 0 && a%1 == 0.5) {
      return (function fact (n) { return n==0.5 ? Math.sqrt(Math.PI)/2 : fact(n-1) * n })(a);
    } else {
      throw 'Factorial for a number not divisible by 0.5 or greater than 0 is not supported.'
    }
  },
  isNaN(a) {
    return isNaN(a);
  },
  round(n, places) {
    const shift = Math.pow(10, places);
    return Math.round(n * shift) / shift;
  },
  roundup(n, places) {
    const shift = Math.pow(10, places);
    return Math.ceil(n * shift) / shift;
  },
  rounddown(n, places) {
    const shift = Math.pow(10, places);
    return Math.floor(n * shift) / shift;
  },
  sqrt(a) {
    return Math.sqrt(a);
  },
  abs(a) {
    return Math.abs(a);
  },
  min(...ns) {
    return Math.min.apply(null, ns);
  },
  max(...ns) {
    return Math.max.apply(null, ns);
  },
  mean(...ns) {
    if (ns.length === 0) {
      throw 'Cannot find median of 0 arguments'
    }
    return ns.reduce((a,b) => a+b, 0) / ns.length;
  },
  median(...ns) {
    if (ns.length === 0) {
      throw 'Cannot find median of 0 arguments'
    }
    const cpy = ns.map(x => x)
    const mid = cpy.length / 2
    cpy.sort();
    if (cpy.length % 2 === 0) {
      return (cpy[mid] + cpy[mid + 1]) / 2;
    } else {
      return cpy[mid + 1];
    }
  },
  sum(...ns) {
    return ns.reduce((a,b) => a + b, 0);
  },
  product(...ns) {
	return ns.reduce((a,b) => a * b, 1);
  },
  variance(...ns) {
    const mean = ns.reduce((a,x) => a + x, 0) / ns.length;
    const sqDiffs = ns.map(function(value) {
      return Math.pow(value-mean, 2);
    });
    const variance = sqDiffs.reduce((a,x) => a + x, 0) / sqDiffs.length;
    return variance;
  },
  stdev(...ns) {
    const mean = ns.reduce((a,x) => a + x, 0) / ns.length;
    const sqDiffs = ns.map(function(value) {
      return Math.pow(value-mean, 2);
    });
    const variance = sqDiffs.reduce((a,x) => a + x, 0) / sqDiffs.length;
    return Math.sqrt(variance);
  },
  // Assuming 24-hour clock
  datediff(date1, date2, units, format = 'ymd', returnSigned = false) {
    let mdate1, mdate2;
    switch (format) {
      case 'ymd': {
        mdate1 = moment(date1, ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss']);
        mdate2 = moment(date2, ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss']);
        break;
      }
      case 'mdy': {
        mdate1 = moment(date1, ['MM-DD-YYYY', 'MM-DD-YYYY HH:mm:ss']);
        mdate2 = moment(date2, ['MM-DD-YYYY', 'MM-DD-YYYY HH:mm:ss']);
        break;
      }
      case 'dmy': {
        mdate1 = moment(date1, ['DD-MM-YYYY', 'DD-MM-YYYY HH:mm:ss']);
        mdate2 = moment(date2, ['DD-MM-YYYY', 'DD-MM-YYYY HH:mm:ss']);
        break;
      }
    }
    const diff = mdate1.diff(mdate2, units, true);
    if (returnSigned) {
      return diff;
    } else {
      return Math.abs(diff);
    }
  }
}
