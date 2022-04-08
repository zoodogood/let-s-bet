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

      this.stats.user.lastNumber     = localStorage["lastNumber"];
      this.stats.user.leastNumber    = localStorage["leastNumber"];
      this.stats.user.greatestNumber = localStorage["greatestNumber"];
    }

    this.fetchAllScore.fetchServerData = fetchServerData;
    this.fetchAllScore.fetchUserData = fetchUserData;
    this.displayStats( this.statusType );
  }

  async displayStats(statusType){
    const isBlueTheme = statusType === "general";
    const node = document.querySelector("body > section");

    const toTag = ({text, value, _handler, ...others}) => _handler ? _handler({text, value, ...others}) : `<li><b>${ text }:</b> ${ value }</li>`;
    const data = {};

    const initGeneralData = async () => {
      await this.fetchAllScore.fetchServerData();

      if (isBlueTheme && this.stats.general === null)
        return node.innerHTML = "<div id = 'fetchError'>Не удалось подружится с сервером<br><small style = 'font-size: 0.5em;'>Доступна локальная (Ваша) статистика</small></div>";

      data.general = {
        main: [
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
          },
          {
            _handler: () => "<br>"
          },
          {
            text: "Последнее угаданное число",
            value: this.stats.general.lastNumber ?? "*не существует*"
          },
          {
            text: "Наибольшее отгаданное",
            value: this.stats.general.greatestNumber ?? "*отсуствует*"
          },
          {
            text: "Наименьшее из отгаданных",
            value: this.stats.general.leastNumber ?? "*сыграйте, чтобы появилось*"
          }
        ],

        steps: [
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
            const getRandomText = (stepCount) => [`За ${ ending(stepCount, "шаг", "ов", "", "а") }`, `Выиграно за ${ stepCount }`, `Побед за ${ stepCount }`].random();

            const total = Object.values(this.stats.general.score)
                .reduce((acc, count) => acc + count, 0);
            const getPercentage = (stepCount) => beautifulPercent( getVictorySize(stepCount) / total * 100 );
            const getVictorySize = (stepCount) => table[`EQUAL_${ stepCount }`];

            const table = this.stats.general.score;
            const steps = Object.keys(table)
              .filter(key => key.startsWith("EQUAL_"))
              .map(key => +key.slice(6));

            steps.sort((a, b) => a - b);
            return steps.map(stepCount => ({ text: getRandomText(stepCount), value: `${ ending( getVictorySize(stepCount), "раз", "", "", "а" ) } (${ getPercentage(stepCount) }%);`}));
          })()
        ]
      }
    }
    const initUserData = () => {
      this.fetchAllScore.fetchUserData();
      data.user = {
        main: [
          {
            text: "Вы окончили игр",
            value: Object.values(this.stats.user.score)
                .reduce((acc, count) => acc + count, 0)
          },
          {
            text: "Посетили сайт",
            value: ending(this.stats.user.visits, "раз", "", "", "а")
          },
          {
            _handler: () => "<br>"
          },
          {
            text: "Время в игре",
            value: (() => {
              let slice = this.stats.user.spendTime;

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
          },
          {
            _handler: () => "<br>"
          },
          {
            text: "Последнее угаданное число",
            value: this.stats.user.lastNumber ?? "*не существует*"
          },
          {
            text: "Наибольшее отгаданное",
            value: this.stats.user.greatestNumber ?? "*отсуствует*"
          },
          {
            text: "Наименьшее из отгаданных",
            value: this.stats.user.leastNumber ?? "*сыграйте, чтобы появилось*"
          }
        ],

        steps: [
          {
            text: "Рекордное прохождение",
            value: (() => {
              const steps = Object.keys(this.stats.user.score)
                .filter(key => key.startsWith("EQUAL_"))
                .map(key => +key.slice(6));

              const minimal = Math.min(...steps);
              const output = ending(minimal, "шаг", "ов", "", "а");

              return output === "Infinity шаг" ? "-" : output;
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
            const getRandomText = (stepCount) => [`За ${ ending(stepCount, "шаг", "ов", "", "а") }`, `Выиграно за ${ stepCount }`, `Побед за ${ stepCount }`].random();

            const total = Object.values(this.stats.user.score)
                .reduce((acc, count) => acc + count, 0);
            const getPercentage = (stepCount) => beautifulPercent( getVictorySize(stepCount) / total * 100 );
            const getVictorySize = (stepCount) => table[`EQUAL_${ stepCount }`];

            const table = this.stats.user.score;
            const steps = Object.keys(table)
              .filter(key => key.startsWith("EQUAL_"))
              .map(key => +key.slice(6));

            steps.sort((a, b) => a - b);
            return steps.map(stepCount => ({ text: getRandomText(stepCount), value: `${ ending( getVictorySize(stepCount), "раз", "", "", "а" ) } (${ getPercentage(stepCount) });`}));
          })()
        ]
      }
    }

    statusType === "general" ? await initGeneralData() : initUserData();

    node.innerHTML = `<ul><p>Основная информация</p>${ data[ statusType ].main.map(toTag).join("") }</ul>  <ul><p>Шаги</p>${ data[ statusType ].steps.map(toTag).join("") }</ul>`;
  }

  #setHandlers(){
    const changer = (clickEvent) => {
      this.statusType = clickEvent.target.id.replace("Stats", "");
      this.fetchAllScore();
      this.updateUI(this.statusType);
    }
    document.querySelectorAll(".statsTypeChanger")
      .forEach(node => node.addEventListener("click", changer));
  }
}

const page = new Page();
page.fetchAllScore();
page.updateUI(page.statusType);
