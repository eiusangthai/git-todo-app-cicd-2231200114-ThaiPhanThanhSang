const { test, expect, _electron: electron } = require('@playwright/test');

test('End-to-end user workflow', async () => {
    const electronApp = await electron.launch({ args: ['.'] });
    const window = await electronApp.firstWindow();

    const taskText = 'My new E2E test task';

    const input = window.locator('#todo-input');
    const addButton = window.locator('#add-todo-btn');

    await input.fill(taskText);
    await addButton.click();

    const todoItem = window.locator('.todo-item');
    await expect(todoItem).toHaveCount(1);
    await expect(todoItem).toContainText(taskText);

    const checkbox = todoItem.locator('input[type="checkbox"]');
    await checkbox.click();
    await expect(todoItem).toHaveClass(/completed/);

    const deleteButton = todoItem.locator('.delete-btn');
    await deleteButton.click();

    await expect(todoItem).toHaveCount(0);

    await electronApp.close();
});
