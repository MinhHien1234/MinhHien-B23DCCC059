import React, { useState } from 'react';
import { Button, Input, Typography } from 'antd';

const { Title, Text } = Typography;

const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const GuessNumberGame: React.FC = () => {
    const [secretNumber, setSecretNumber] = useState(getRandomNumber(1, 100));
    const [attempts, setAttempts] = useState(10);
    const [message, setMessage] = useState('');
    const [guess, setGuess] = useState<string>('');

    const handleGuess = () => {
        const num = parseInt(guess, 10);
        if (isNaN(num) || num < 1 || num > 100) {
            setMessage("Vui lòng nhập một số hợp lệ trong khoảng từ 1 đến 100!");
            return;
        }

        if (num < secretNumber) {
            setMessage("Bạn đoán quá thấp!");
        } else if (num > secretNumber) {
            setMessage("Bạn đoán quá cao!");
        } else {
            setMessage("Chúc mừng! Bạn đã đoán đúng!");
            return;
        }

        setAttempts(prev => prev - 1);
        if (attempts - 1 === 0) {
            setMessage(`Bạn đã hết lượt! Số đúng là ${secretNumber}.`);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <Title>Trò chơi đoán số</Title>
            <Text>Tôi đã chọn một số trong khoảng từ 1 đến 100. Bạn có {attempts} lượt để đoán!</Text>
            <br /><br />
            <Input 
                type="number" 
                value={guess} 
                onChange={(e) => setGuess(e.target.value)} 
                placeholder="Nhập số bạn đoán" 
                disabled={attempts === 0}
            />
            <br /><br />
            <Button onClick={handleGuess} disabled={attempts === 0}>Đoán</Button>
            <br /><br />
            <Text>{message}</Text>
        </div>
    );
};

export default GuessNumberGame;
