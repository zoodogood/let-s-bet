function delay(ms){
  return new Promise(res => setTimeout(res, ms));
}

function beautifulPercent(percent){
  const isMinus = Math.sign(percent) === -1;
  if (isMinus)
    percent *= -1;

  const result = (entire, float = null) => `${ isMinus ? "-" : "" }${ entire }${ float ? `.${ float }` : "" }%`;

  const [entire, floatRemainder] = String(percent).split(".");
  const THRESHOLDER = 4;

  if (entire.length >= THRESHOLDER)
    return result(entire);

  if (floatRemainder === undefined)
    return result(entire);

  const index = entire === "0" ? [...floatRemainder].findIndex(digit => digit !== "0") : 0;

  const cutZeros = (string) => {
    while (string.at(-1) === "0")
      string = string.slice(0, -1);

    return string;
  }
  const float = cutZeros(
    floatRemainder.slice(0, index + THRESHOLDER - entire.length)
  );
  
  return result(entire, float);
}


function ending(numb = 0, wordBase, zerofifth, first, second, opt = {}) {
  numb = +numb;

  if ( isNaN(numb) )
    return NaN;

  let fix = Infinity;

  if (numb > 20)
    fix = 10;

  let end = (numb % fix > 4 || numb % fix == 0) ? zerofifth : (numb % fix > 1) ? second : first;

  input = wordBase + end;
  if (opt.bold) {
    numb = "**" + numb + "**";
  }
  if (!opt.slice){
    input = numb + " " + input;
  }
  return input;
};


function random(...arguments){
  let lastArgument = arguments.splice(-1)[0];
  let options = {round: true};

  if (typeof lastArgument === "object"){
    Object.assign(options, lastArgument);
    lastArgument = arguments.splice(-1)[0];
  }

  const max = lastArgument + Number(options.round);
  const min = arguments.length ? arguments[0] : 0;
  let rand = Math.random() * (max - min) + min;

  if (options.round){
    rand = Math.floor(rand);
  }
  return rand;
}


Object.defineProperty(Array.prototype, "random", {
  value: function (pop, weights){
    let index;
    if (weights) {
      let last = 0;
      let limites = this.map((e, i) => last = e._weight + last);

      let rand = Math.random() * limites.at(-1);
      index = limites.findIndex(e => e >= rand);
    }
    else index = Math.floor(Math.random() * this.length);

    let input = this[index];
    if (pop) this.splice(index, 1);
    return input;
  }
});
