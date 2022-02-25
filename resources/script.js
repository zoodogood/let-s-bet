globalThis.snow = new SnowBackground();




class Game {
  constructor({ button }){
    this.element = document.querySelector(button);

    this.number = {
      min: 0,
      max: 1_000_000,
      value: random(0, 1_000_000)
    }

    this.user = {
      combo: 0,
      score: 0,
      darkTheme: false,
      indicated: null,
      victory: null,
      _upper: false
    }

    this.element.addEventListener("click", this.#clickHandler.bind(this));
  }


  async #clickHandler(){
    if (this.user.darkTheme)
      return this.#darkredClickHandler();

    this.#changeMainColor();

    this.#removeSomeNodes();

    await delay( 300 );
    await this.#changeTextContents();

    this.#setInput();
    this.counter = new Counter();
  }


  #changeMainColor(){
    const root = document.documentElement.style;
    root.setProperty("--mainColor", this.constructor.alternativeTheme);
    root.setProperty("--buttonBackground", "linear-gradient(45deg, black, var( --mainColor ))");
    this.user.darkTheme = true;
  }

  static alternativeTheme = "darkred"; // maroon


  #removeSomeNodes(){
    this.constructor.nodesBeRemoved.forEach(async query => {
      let node = document.querySelector(query);
      node.classList.add("removed");

      await delay(900);
      node.remove();
    });
  }

  static nodesBeRemoved = ["body > section > span"];


  async #changeTextContents(){
    this.#changeTextContents.fillDescription = async () => {
      const node = document.querySelector("body > article");

      const glitch = new GlitchText(node.textContent, `Укажите число от ${ this.number.min.toLocaleString(undefined, { useGrouping: true }) } до ${ this.number.max.toLocaleString(undefined, { useGrouping: true }) },\n что на счёт того, чтобы попробовать ${ Math.floor((this.number.min + this.number.max) / 2).toLocaleString(undefined, { useGrouping: true }) }?`);
      for (const content of glitch){
        node.textContent = content;
        await delay(15);
      }
    }

    this.#changeTextContents.fillButton = async () => {
      const glitch = new GlitchText(this.element.textContent, "Отдать число", {speed: 5});
      for (const content of glitch){
        this.element.textContent = content;
        await delay(5);
      }
    }

    this.#changeTextContents.fillParagraph = async (isUpper) => {
      const node = document.querySelector("body > p");

      const prefix = this.user.score === 1 ? "загаданное число " : this.user.score === 2 ? "число " : "";
      const direction = isUpper ? "больше" : "меньше";
      const combo =
        this.user.combo > 12 ? "ГОРАЗДО же.." :
        this.user.combo > 4  ? "все ещё " :
        this.user.combo > 1  ? "ещё " : "";

      const glitch = new GlitchText(node.textContent, `Нет, ${ prefix }${ combo }${ direction }`);
      for (const content of glitch){
        node.textContent = content;
        await delay(5);
      }
    }

    await this.#changeTextContents.fillDescription();
    await this.#changeTextContents.fillButton();
  }


  #setInput(){
    const node = document.querySelector("body > input");
    node.style.display = "block";


    this.input = new InputHandler(this, node);
  }


  async #darkredClickHandler(){
    if (this.user.victory !== null)
      return;

    if (!this.input.node.value){
      this.input.node.classList.add("ping-animation");
      setTimeout(() =>
        this.input.node.classList.remove("ping-animation"),
        500
      );
      return;
    }

    this.user.score++;
    this.counter.count( this.user.score );

    this.user.indicated = +this.input.node.value;
    this.input.node.value = "";

    if (this.user.indicated === this.number.value)
      return this.#victoryHandler();

    if (this.user.score === 100)
      return this.#failHandler();

    const isUpper = this.number.value > this.user.indicated;
    this.number[ isUpper ? "min" : "max" ] = this.user.indicated;

    this.user.combo = isUpper === this.user._upper ? ++this.user.combo : 0;
    this.user._upper = isUpper;


    this.input.node.focus();
    await this.#changeTextContents.fillParagraph(isUpper);
    await this.#changeTextContents.fillDescription();
  }


  async #victoryHandler(){
    this.user.victory = true;
    alert(`Вы угадали число от 0 до Миллиона! Самый эффективный способ найти число — всегда указывать значение между минимальным и максимальным возможным. Если следовать этому правилу, то число в худшем исходе Вы найдёте всего за 21 шаг. За 150 ходов-же можно отыскать число с 45 нулями.. очень много)\nВ программировании такой простой приём называется "Бинарный поиск" и знатно оптимизирует некоторые алгоритмы - пользователи радуются\nВы справились за ${ ending( this.user.score, "попыт", "ок", "ку", "ки" ) }`);
    snow.storm = true;

    (async () => {
      const node = document.querySelector("body > p");
      const glitch = new GlitchText(node.textContent, `Число — ${ this.number.value }`);
      for (const content of glitch) {
        node.textContent = content;
        await delay(30);
      }
    })();

    (async () => {
      const node = document.querySelector("body > article");
      const glitch = new GlitchText(node.textContent, `Всего ${ ending(this.user.score, "шаг", "ов", "", "") }, впечатляюще!`, {speed: 5});
      for (const content of glitch) {
        node.textContent = content;
        await delay(30);
      }
    })();

    (async () => {
      const node = this.element;
      node.style.display = "none";
    })();

    (async () => {
      const node = document.querySelector("body > input");
      const glitch = new GlitchText(node.getAttribute("placeholder"), `Победа`);
      for (const content of glitch) {
        node.setAttribute("placeholder", content);
        await delay(5);
      }
    })();

  }

  #failHandler(){
    this.user.victory = false;
    alert("Вы очень, очень-очень плохой игрок. Ну-с. Спор Вы выиграли несправившись с таким простым заданием. Самый эффективный способ найти число — всегда указывать значение между минимальным и максимальным возможным. Если следовать этому правилу, то число в худшем исходе Вы найдёте всего за 21 шаг. За 150 ходов-же можно отыскать число с 45 нулями.. очень много\nВ программировании такой простой приём называется \"Бинарный поиск\" и знатно оптимизирует некоторые алгоритмы");

    snow.storm = true;

    (async () => {
      const node = document.querySelector("body > p");
      const glitch = new GlitchText(node.textContent, `Число — ${ this.number.value }`);
      for (const content of glitch) {
        node.textContent = content;
        await delay(30);
      }
    })();

    (async () => {
      const node = document.querySelector("body > article");
      const glitch = new GlitchText(node.textContent, `Упс..`, {speed: 5});
      for (const content of glitch) {
        node.textContent = content;
        await delay(30);
      }
    })();

    (async () => {
      const node = this.element;
      node.style.display = "none";
    })();

    (async () => {
      const node = document.querySelector("body > input");
      const glitch = new GlitchText(node.getAttribute("placeholder"), `Проигрыш`);
      for (const content of glitch) {
        node.setAttribute("placeholder", content);
        await delay(5);
      }
    })();
  }
}

new Game({ button: ".button" });


class InputHandler {
  constructor(game, node){
    this.node = node;
    this.game = game;

    this.node.addEventListener("input", () => {
      const value = this.node.value;

      if (value > 1_000_000)
        this.node.value = 1_000_000;

      if (value < 0)
        this.node.value = 0;

      value ? this.node.classList.remove("shake-little") : this.node.classList.add("shake-little");
    });

    this.node.addEventListener("change", () => {
      const value = this.node.value;

      if (value > this.game.number.max)
        this.node.value = this.game.number.max - 1;

      if (value < this.game.number.min)
        this.node.value = this.game.number.min + 1;

    });

    this.node.addEventListener("keydown", keyEvent => {
      if (keyEvent.code !== "Enter")
        return;

      keyEvent.preventDefault();
      this.game.element.focus();
      this.game.element.click();
    })

    this.node.classList.add("shake-little", "shake-constant", "shake-constant--hover");
  }


}


class Counter {
  constructor(){
    this.node = document.createElement("nav");
    this.node.className = "counter";

    document.body.append(this.node);
    this.count(0);
  }


  count(value){
    this.node.textContent = value;
  }
}
