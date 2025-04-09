import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

describe('Todo App', () => {
    it('should fetch todos and render them', async () => {

        axios.get.mockResolvedValue({
            data: [{
                id: 1,
                title: 'Test Todo',
                description: 'Test Description',
                is_done: false
            }]
        });

        render(<App/>);

        // Check if the _todo is rendered with description
        await screen.findByText('Test Todo');
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('should add a new todo with title and description', async () => {
        axios.get.mockResolvedValue({data: []});
        axios.post.mockResolvedValue({
            data: {
                id: 2,
                title: 'New Todo',
                description: 'New Description',
                is_done: false
            }
        });

        render(<App/>);

        const titleInput = screen.getByPlaceholderText('Add a new task title');
        const descriptionInput = screen.getByPlaceholderText('Add a description');
        const button = screen.getByText('Add');

        fireEvent.change(titleInput, {target: {value: 'New Todo'}});
        fireEvent.change(descriptionInput, {target: {value: 'New Description'}});
        fireEvent.click(button);

        await screen.findByText('New Todo');
        expect(screen.getByText('New Description')).toBeInTheDocument();
    });

    it('should edit a todo', async () => {
        axios.put.mockResolvedValue({
            data: {
                id: 1,
                title: 'Updated Todo',
                description: 'Updated Description',
                is_done: false
            }
        });
        axios.get.mockResolvedValue({
            data: [{
                id: 1,
                title: 'Test Todo',
                description: 'Test Description',
                is_done: false
            }]
        });

        render(<App/>);

        await screen.findByText('Test Todo');

        const editButton = screen.getByText('Edit');
        fireEvent.click(editButton);

        const titleInput = screen.getByDisplayValue('Test Todo');
        const descriptionInput = screen.getByDisplayValue('Test Description');

        fireEvent.change(titleInput, {target: {value: 'Updated Todo'}});
        fireEvent.change(descriptionInput, {target: {value: 'Updated Description'}});
        fireEvent.click(screen.getByText('Save'));

        await screen.findByText('Updated Todo');
        expect(screen.getByText('Updated Description')).toBeInTheDocument();
    });

    it('should delete a todo', async () => {
        axios.delete.mockResolvedValue({});
        axios.get.mockResolvedValue({
            data: [{
                id: 1,
                title: 'Test Todo',
                description: 'Test Description',
                is_done: false
            }]
        });

        render(<App/>);

        await screen.findByText('Test Todo');

        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);

        await waitFor(() => expect(screen.queryByText('Test Todo')).toBeNull());
    });
});
