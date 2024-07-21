async function getDashboardData(url = '/data.json'){
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

class getDashboardItem {

    static PERIODS = {
        daily: 'day',
        weekly: 'week',
        monthly: 'month',
    }

    constructor(data, container = '.dashboard__content', view = 'weekly') {
        this.data = data;
        this.container = document.querySelector(container);
        this.view = view;

        this.createMarkup();
    }

    createMarkup(){
        const {title, timeframes} = this.data;

        const id = title.toLowerCase().replace(/ /g, '-');

        const {current, previous} = this.data.timeframes[this.view.toLowerCase()];

        this.container.insertAdjacentHTML('beforeend', `
        <div class="dashboard__item dashboard__item--${id}">
        <article class="tracking-card">
          <header class="tracking-card__header">
            <h4 class="tracking-card__title">${title}</h4>
            <img src="images/icon-ellipsis.svg" alt="menu" class="tracking-card__menu">
          </header>
          <div class="tracking-card__body">
           <div class="tracking-card__time">
            ${current}hrs
           </div>
           <div class="tracking-card__prev-period">
            Last ${getDashboardItem.PERIODS[this.view]} - ${previous}hrs
           </div>
          </div>
        </article>

      </div>
        `)

        this.time = this.container.querySelector(`.dashboard__item--${id} .tracking-card__time`);
        this.prev = this.container.querySelector(`.dashboard__item--${id} .tracking-card__prev-period`);

    }

    changeView(view) {
        this.view = view.toLowerCase();
        const {current, previous} = this.data.timeframes[this.view.toLowerCase()];
// изменяем внутри текст
        this.time.innerText = `${current}hrs`;
        this.prev.innerText = `Last ${getDashboardItem.PERIODS[this.view]} - ${previous}hrs`;

    }

}

// у нас есть класс, адресуем страницу

document.addEventListener('DOMContentLoaded', () => {
    getDashboardData()
        .then(data => {
            const activites = data.map(activity => new getDashboardItem(activity));
            
            const selectors = document.querySelectorAll('.view-selector__item');
            selectors.forEach(selector => 
                selector.addEventListener('click', function(){
                    selectors.forEach(sel => sel.classList.remove('view-selector__item--active'))
                    selector.classList.add('view-selector__item--active');

                    const currentView = selector.innerText.trim().toLowerCase();
                    activites.forEach(activity => activity.changeView(currentView))
                }))
        })
})

