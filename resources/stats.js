globalThis.snow = new SnowBackground();
const BASE_URL = "https://stats-co.zoodogood.repl.co/let-s-bet/";



class Page {
  constructor(){
    this.statusType = "general";
    this.#setHandlers();

    this.stats = {};
  }

  updateUI(statusType){
    const isBlueTheme = statusType === "general";

    const root = document.documentElement.style;
    root.setProperty("--mainColor", isBlueTheme ? "dodgerblue" : "darkred");
    snow.storm = !isBlueTheme;
    document.querySelectorAll(".statsTypeChanger").forEach(node => node.classList.remove("underline"));
    document.getElementById(`${ statusType }Stats`).classList.add("underline");
  }

  async fetchAllScore(){
    const fetchServerData = async () => {
      const fetchOptions = {
        method: "GET",
        cache: "default",
        credentials: "same-origin",
        headers: {
          "Content-Type": "text/plain"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer"
      };
      const response = await fetch(BASE_URL, fetchOptions)
        .catch(() => this.stats.general = null);

      if (!response)
        return;

      const data = await response.json();
      this.stats.general = data;
    }

    const fetchUserData = () => {
      this.stats.user = {};
      this.stats.user.visits = localStorage["visits"] || 0;
      this.stats.user.score  = JSON.parse(localStorage["score"] ?? "{}");

      this.stats.user.recordTimeEnd = localStorage["recordTimeEnd"] ?? 0;
      this.stats.user.spendTime = localStorage["spendTime"] ?? 0;
    }


    await fetchServerData();
    fetchUserData();
    this.displayStats( this.statusType );
  }

  displayStats(statusType){
    const isBlueTheme = statusType === "general";
    const node = document.querySelector("body > section");

    if (isBlueTheme && this.stats.general === null)
      return node.innerHTML = "<div id = 'fetchError'>Не удалось подружится с сервером</div>";

    console.log(this.stats);
    const toTag = ({text, value, _handler, ...others}) => _handler ? _handler({text, value, ...others}) : `<li><b>${ text }:</b> ${ value }</li>`;

    const data = {
      generalMain: [
        {
          text: "Всего окончено игр",
          value: Object.values(this.stats.general.score)
              .reduce((acc, count) => acc + count, 0)
        },
        {
          text: "Количество игроков",
          value: this.stats.general.uniqueUser
        },
        {
          text: "Посещений сайта",
          value: this.stats.general.visits
        },
        {
          _handler: () => "<br>"
        },
        {
          text: "Время в игре",
          value: (() => {
            let slice = this.stats.general.spendTime;

            const days  = slice / 86_400_000;
            const hours = (slice % 86_400_000) / 3_600_000;
            const minutes = (slice % 3_600_000) / 60_000;
            const seconds = (slice % 60_000) / 1000;

            return `${ ~~days }д, ${ ("00" + ~~hours).slice(-2) }:${ ("00" + ~~minutes).slice(-2) }:${ ("00" + ~~seconds).slice(-2) }с`;
          })()
        },
        {
          text: "Самое быстрое прохождение",
          value: (() => {
            let slice = this.stats.general.recordTimeEnd;

            const seconds = (slice) / 1000;
            const milliseconds = slice % 1000;

            return `${ ~~seconds }.${milliseconds}с`;
          })()
        },
        {
          text: "В среднем",
          value: (() => {
            const total = Object.values(this.stats.general.score)
                .reduce((acc, count) => acc + count, 0);

            const average = ~~(this.stats.general.spendTime / total);

            const hours = (average % 86_400_000) / 3_600_000;
            const minutes = (average % 3_600_000) / 60_000;
            const seconds = (average % 60_000) / 1000;

            return `${ ("00" + ~~hours).slice(-2) }:${ ("00" + ~~minutes).slice(-2) }:${ ("00" + ~~seconds).slice(-2) }`;
          })()
        }
      ],

      generalSteps: [
        {
          text: "Рекордное прохождение",
          value: (() => {
            const steps = Object.keys(this.stats.general.score)
              .filter(key => key.startsWith("EQUAL_"))
              .map(key => +key.slice(6));

            const minimal = Math.min(...steps);

            return ending(minimal, "шаг", "ов", "", "а");
          })()
        },
        {
          text: "Более чем за 100 шагов",
          value: this.stats.general.score.BIG_100 ?? 0
        },
        {
          _handler: () => "<br>"
        },
        ...(() => {
          const getRandomText = (stepCount) => [`За ${ ending(stepCount, "шаг", "ов", "", "а") }`, `Выиграно за ${ stepCount }`].random();

          const total = Object.values(this.stats.general.score)
              .reduce((acc, count) => acc + count, 0);
          const getPercentage = (stepCount) => getVictorySize(stepCount) / total * 100;
          const getVictorySize = (stepCount) => table[`EQUAL_${ stepCount }`];

          const table = this.stats.general.score;
          const steps = Object.keys(table)
            .filter(key => key.startsWith("EQUAL_"))
            .map(key => +key.slice(6));

          steps.sort((a, b) => b - a);
          return steps.map(stepCount => ({ text: getRandomText(stepCount), value: `${ ending( getVictorySize(stepCount), "раз", "", "", "а" ) } (${ getPercentage(stepCount) }%);`}));
        })()
      ],

      userMain: [
        {
          text: "Вы окончили игр",
          value: Object.values(this.stats.user.score)
              .reduce((acc, count) => acc + count, 0)
        },
        {
          text: "Посещений сайта",
          value: this.stats.user.visits
        },
        {
          _handler: () => "<br>"
        },
        {
          text: "Время в игре",
          value: (() => {
            let slice = this.stats.general.spendTime;

            const days  = slice / 86_400_000;
            const hours = (slice % 86_400_000) / 3_600_000;
            const minutes = (slice % 3_600_000) / 60_000;
            const seconds = (slice % 60_000) / 1000;

            return `${ ~~days }д, ${ ("00" + ~~hours).slice(-2) }:${ ("00" + ~~minutes).slice(-2) }:${ ("00" + ~~seconds).slice(-2) }с`;
          })()
        },
        {
          text: "Самое быстрое прохождение",
          value: (() => {
            let slice = this.stats.user.recordTimeEnd;

            const seconds = (slice) / 1000;
            const milliseconds = slice % 1000;

            return `${ ~~seconds }.${milliseconds}с`;
          })()
        },
        {
          text: "В среднем",
          value: (() => {
            const total = Object.values(this.stats.user.score)
                .reduce((acc, count) => acc + count, 0);

            const average = ~~(this.stats.user.spendTime / total);

            const hours = (average % 86_400_000) / 3_600_000;
            const minutes = (average % 3_600_000) / 60_000;
            const seconds = (average % 60_000) / 1000;

            return `${ ("00" + ~~hours).slice(-2) }:${ ("00" + ~~minutes).slice(-2) }:${ ("00" + ~~seconds).slice(-2) }`;
          })()
        }
      ],

      userSteps: [
        {
          text: "Рекордное прохождение",
          value: (() => {
            const steps = Object.keys(this.stats.user.score)
              .filter(key => key.startsWith("EQUAL_"))
              .map(key => +key.slice(6));

            const minimal = Math.min(...steps);

            return ending(minimal, "шаг", "ов", "", "а");
          })()
        },
        {
          text: "Более чем за 100 шагов",
          value: this.stats.user.score.BIG_100 ?? 0
        },
        {
          _handler: () => "<br>"
        },
        ...(() => {
          const getRandomText = (stepCount) => [`За ${ ending(stepCount, "шаг", "ов", "", "а") }`, `Выиграно за ${ stepCount }`].random();

          const total = Object.values(this.stats.user.score)
              .reduce((acc, count) => acc + count, 0);
          const getPercentage = (stepCount) => getVictorySize(stepCount) / total * 100;
          const getVictorySize = (stepCount) => table[`EQUAL_${ stepCount }`];

          const table = this.stats.user.score;
          const steps = Object.keys(table)
            .filter(key => key.startsWith("EQUAL_"))
            .map(key => +key.slice(6));

          steps.sort((a, b) => b - a);
          return steps.map(stepCount => ({ text: getRandomText(stepCount), value: `${ ending( getVictorySize(stepCount), "раз", "", "", "а" ) } (${ getPercentage(stepCount) }%);`}));
        })()
      ]
    }

    node.innerHTML = `<ul><p>Основная информация</p>${ data[`${ statusType }Main`].map(toTag).join("") }</ul>  <ul><p>Шаги</p>${ data[`${ statusType }Steps`].map(toTag).join("") }</ul>`;
  }

  #setHandlers(){
    const changer = (clickEvent) => {
      this.fetchAllScore();
      this.statusType = clickEvent.target.id.replace("Stats", "");
      this.updateUI(this.statusType);
    }
    document.querySelectorAll(".statsTypeChanger")
      .forEach(node => node.addEventListener("click", changer));
  }
}

const page = new Page();
page.fetchAllScore();
page.updateUI(page.statusType);
