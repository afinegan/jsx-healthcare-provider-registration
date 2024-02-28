import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegistrationForm from './RegistrationForm';
jest.mock("../utilities/security", () => ({
    getPublicEncryptionKey: jest.fn().mockResolvedValue("mock-public-key"),
    importPublicKey: jest.fn().mockResolvedValue("mock-imported-public-key"),
    encryptWithPublicKey: jest.fn().mockImplementation((data) => Promise.resolve(`encrypted-${data}`)),
}));

describe('Component RegistrationForm', () => {
    test('should render the registration form', () => {
        render(<RegistrationForm />);
        expect(screen.getByText(/Healthcare Provider Registration/i)).toBeInTheDocument();
    });

    test('should validate that all fields are required before submitting', async () => {
        render(<RegistrationForm />);
        fireEvent.click(screen.getByText(/Register/i));
        await waitFor(() => expect(screen.getAllByText(/This field is required/i)).toHaveLength(6));
    });

    test('should submit the form with encrypted data', async () => {
        render(<RegistrationForm />);
        fireEvent.change(screen.getByPlaceholderText(/Enter firstName/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText(/Enter lastName/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByPlaceholderText(/Enter npiNumber/i), { target: { value: 12345 } });
        fireEvent.change(screen.getByPlaceholderText(/Enter businessAddress/i), { target: { value: '1234 smith way' } });
        fireEvent.change(screen.getByPlaceholderText(/Enter telephoneNumber/i), { target: { value: 1234567890 } });
        fireEvent.change(screen.getByPlaceholderText(/Enter emailAddress/i), { target: { value: 'john.doe@gmail.com' } });

        fireEvent.click(screen.getByText(/Register/i));

        await screen.findByText(/Submitting.../i);
        // Simulate a delay for the submission
        await new Promise((r) => setTimeout(r, 2100));
        expect(screen.getByText(/Registration successful!/i)).toBeInTheDocument();
    });
});
