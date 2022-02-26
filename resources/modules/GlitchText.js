class GlitchText {
  constructor(from = "", to = "hello, world", {step = 15} = {}){
    this.from = from;
    this.to   = to;

    this.step = step;

    this[Symbol.iterator] = this.iteratorFunction;
  }

  *iteratorFunction(){
    let word = [...this.from];
    const target = this.to;

    while (word.length !== target.length){
      if (word.length > target.length)
        word.pop();

      if (word.length < target.length)
        word.push("#");

      word = word.map(letter => String.fromCharCode( random(20, 40) ));
      yield word.join("");
    }



    while ( word.join("") !== target ){

      word.forEach((letter, i) => {
        if (letter === target[i])
          return;


        const
          charCode   = letter.charCodeAt(0),
          targetCode = target[i].charCodeAt(0);

        const isUpper = targetCode > charCode;

        const step = Math.min(
          Math.abs(targetCode - charCode),
          this.step
        );
        word[i] = String.fromCharCode( isUpper ? charCode + step : charCode - step  );
      });

      yield word.join("");
    }


    return;
  }
}
