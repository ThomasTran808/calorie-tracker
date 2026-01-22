class CalorieTracker {
    constructor() {
        this.meals = [];
        this.dailyGoal = 2000;
        this.loadFromLocalStorage();
        this.init();
    }

    init() {
        this.displayCurrentDate();
        this.setupEventListeners();
        this.updateDisplay();
    }

    displayCurrentDate() {
        const dateElement = document.getElementById('current-date');
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }

    setupEventListeners() {
        const addMealBtn = document.getElementById('add-meal-btn');
        const resetDayBtn = document.getElementById('reset-day-btn');
        const dailyGoalInput = document.getElementById('daily-goal');
        const mealCaloriesInput = document.getElementById('meal-calories');
        const mealNameInput = document.getElementById('meal-name');

        addMealBtn.addEventListener('click', () => this.addMeal());
        resetDayBtn.addEventListener('click', () => this.resetDay());
        dailyGoalInput.addEventListener('input', (e) => {
            this.dailyGoal = parseInt(e.target.value) || 0;
            this.saveToLocalStorage();
            this.updateDisplay();
        });

        mealCaloriesInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addMeal();
        });

        mealNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addMeal();
        });
    }

    addMeal() {
        const mealNameInput = document.getElementById('meal-name');
        const mealCaloriesInput = document.getElementById('meal-calories');

        const mealName = mealNameInput.value.trim();
        const calories = parseInt(mealCaloriesInput.value);

        if (!mealName || !calories || calories <= 0) {
            alert('Please enter a valid meal name and calorie amount');
            return;
        }

        const meal = {
            id: Date.now(),
            name: mealName,
            calories: calories,
            timestamp: new Date().toLocaleTimeString()
        };

        this.meals.push(meal);
        this.saveToLocalStorage();
        this.updateDisplay();

        mealNameInput.value = '';
        mealCaloriesInput.value = '';
        mealNameInput.focus();
    }

    deleteMeal(id) {
        this.meals = this.meals.filter(meal => meal.id !== id);
        this.saveToLocalStorage();
        this.updateDisplay();
    }

    resetDay() {
        if (confirm('Are you sure you want to reset today\'s data?')) {
            this.meals = [];
            this.saveToLocalStorage();
            this.updateDisplay();
        }
    }

    calculateTotalCalories() {
        return this.meals.reduce((total, meal) => total + meal.calories, 0);
    }

    updateDisplay() {
        const totalCalories = this.calculateTotalCalories();
        const remaining = this.dailyGoal - totalCalories;
        const percentage = Math.min((totalCalories / this.dailyGoal) * 100, 100);

        document.getElementById('total-calories').textContent = totalCalories;
        document.getElementById('remaining-calories').textContent = remaining;
        document.getElementById('daily-goal').value = this.dailyGoal;

        const remainingElement = document.getElementById('remaining-calories');
        if (remaining < 0) {
            remainingElement.classList.add('over-goal');
        } else {
            remainingElement.classList.remove('over-goal');
        }

        const progressFill = document.getElementById('progress-fill');
        progressFill.style.width = percentage + '%';

        if (percentage > 100) {
            progressFill.style.background = 'linear-gradient(90deg, #dc3545 0%, #c82333 100%)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
        }

        this.renderMeals();
    }

    renderMeals() {
        const mealsContainer = document.getElementById('meals-container');

        if (this.meals.length === 0) {
            mealsContainer.innerHTML = '<li style="text-align: center; color: #6c757d; padding: 20px;">No meals added yet</li>';
            return;
        }

        mealsContainer.innerHTML = this.meals.map(meal => `
            <li class="meal-item">
                <div class="meal-info">
                    <div class="meal-name">${meal.name}</div>
                    <small style="color: #6c757d;">${meal.timestamp}</small>
                </div>
                <span class="meal-calories">${meal.calories} cal</span>
                <button class="delete-btn" onclick="tracker.deleteMeal(${meal.id})">Delete</button>
            </li>
        `).join('');
    }

    saveToLocalStorage() {
        const data = {
            meals: this.meals,
            dailyGoal: this.dailyGoal,
            date: new Date().toDateString()
        };
        localStorage.setItem('calorieTrackerData', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const savedData = localStorage.getItem('calorieTrackerData');
        if (savedData) {
            const data = JSON.parse(savedData);
            const today = new Date().toDateString();

            if (data.date === today) {
                this.meals = data.meals || [];
                this.dailyGoal = data.dailyGoal || 2000;
            } else {
                this.meals = [];
                this.dailyGoal = data.dailyGoal || 2000;
            }
        }
    }
}

const tracker = new CalorieTracker();
