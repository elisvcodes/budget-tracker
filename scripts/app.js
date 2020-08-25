class UI {
    constructor() {
        this.displayIncome = document.getElementById('income');
        this.displayExpense = document.getElementById('expense');
        this.displayTotal = document.getElementById('total');

        this.inputName = document.getElementById('name-input')
        this.incomeInput = document.getElementById('income-input');
        this.expenseInput = document.getElementById('expense-input');

        this.incomeOption = document.getElementById('option-income');
        this.expenseOption = document.getElementById('option-expense');

        this.budgetList = document.getElementById('list');

        this.budget = []
        this.id = 0;

    }

    displayOption(e) {
        if (e.target.value == 'income') {
            this.expenseInput.style.display = 'none';
            this.incomeInput.style.display = 'block';
            this.incomeInput.disabled = false;
        } else if (e.target.value == 'expense') {
            this.incomeInput.style.display = 'none';
            this.expenseInput.style.display = 'block';
        }
    }

    submit(type) {
        const id = this.id;
        const title = this.inputName.value;

        const input = type === 'income' ? this.incomeInput : this.expenseInput;
        const option = type === 'income' ? this.incomeOption : this.expenseOption;
        const display = type === 'income' ? this.displayIncome : this.displayExpense;
        
        const amount = parseFloat(input.value);
        const typeOf = option.value;

        const income = {
            id,
            type: typeOf,
            title,
            amount
        }
        this.budget.push(income);
        this.addToBudget(income);
        this.getTotal();
        this.id++;
        this.inputName.value = '';
        input.value = '';
    }

    addToBudget(item) {
        const div = document.createElement('div');
        div.classList.add('row');
        div.innerHTML =  `
        <div class="column">
        <p data-id="${item.id}">${item.title}</p>
    </div>
    <div class="column">
        <p data-id="${item.id}">$ ${item.amount}</p>
    </div>
    <div class="column">
        <p data-id="${item.id}">${item.type}</p>
        <a href="" class="edit-icon" data-id="${item.id}">
            <i class="fa fa-pencil-square-o icon" aria-hidden="true"></i>
        </a>
        <a href="" class="remove-icon" data-id="${item.id}">
            <i class="fa fa-trash icon" aria-hidden="true"></i>
        </a>
    </div>
        `;

        this.budgetList.appendChild(div);
    }

    calcIncome() {
        let incomeTotal = 0;
        let incomeArr = this.budget.filter(item => {
            return item.type === 'income'
        });
        incomeTotal = incomeArr.reduce((acc, curr) => {
            return acc+= curr.amount;
        }, 0);
        this.displayIncome.textContent = incomeTotal;
        return incomeTotal;
    }

    calcExpense() {
        let expenseTotal = 0;
        let expenseArr = this.budget.filter(item => {
            return item.type === 'expense'
        });
        expenseTotal = expenseArr.reduce((acc, curr) => {
            return acc+=curr.amount;
        }, 0)
        this.displayExpense.textContent = expenseTotal;
        return expenseTotal;
    }

    getTotal() {
        this.displayTotal.textContent = `$ ${this.calcIncome() - this.calcExpense()}`;
    }

    edit(e) {
        const id = parseInt(e.target.parentNode.dataset.id);

        const removeItem = e.target.parentNode.parentNode.parentNode;
        e.target.parentNode.parentNode.parentNode.remove(removeItem);

        let choosen = this.budget.filter(item => {
            return item.id === id;
        });

        if (choosen[0].type === 'income') {
            this.inputName.value = choosen[0].title;
            this.incomeInput.value = choosen[0].amount;
            this.incomeOption.value = choosen[0].type;
        } else {
            this.inputName.value = choosen[0].title;
            this.expenseInput.value = choosen[0].amount;
            this.expenseOption.value = choosen[0].type;
        }

        let tempBudget = this.budget.filter(item => {
            return item.id !== id;
        });

        this.budget = tempBudget;

        this.getTotal();
    }

    remove(e) {
        const id = parseInt(e.target.parentNode.dataset.id);

        const removeItem = e.target.parentNode.parentNode.parentNode;
        e.target.parentNode.parentNode.parentNode.remove(removeItem);

        let tempBudget = this.budget.filter(item => {
            return item.id !== id;
        });

        this.budget = tempBudget;

        this.getTotal();
    }
}

const eventListeners = () => {
    const form = document.getElementById('form');
    const selectType = document.getElementById('type');
    const list = document.getElementById('list');

    const ui = new UI();

    selectType.addEventListener('change', (e) => {
        ui.displayOption(e);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (selectType.value == 'income') {
            ui.submit('income');
        } else if (selectType.value == 'expense') {
            ui.submit('expense');
        }
    });

    list.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.parentNode.classList.contains('edit-icon')) {
            ui.edit(e);
        } else if (e.target.parentNode.classList.contains('remove-icon')) {
            ui.remove(e)
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    eventListeners();
})