import React from 'react';

type Props = {
    name: string
    age?: number
};

const Hello = ({name, age}: Props) => {
    return (
        <div>
            <p>Hello, {name}!</p>
            {age && <p>You are {age} years old.</p>}
        </div>
    );
}

const a = (address: string) => {
    return <p>{address}</p>
}



