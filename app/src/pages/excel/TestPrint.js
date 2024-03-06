import React from 'react';

const TestPrint = () => {

    // const { print } = usePrinter();

    const handlePrint = () => {
        // // Aquí debes tener el contenido que deseas imprimir
        // const contentToPrint = '<h1>Hola, esto es un ejemplo de impresión térmica en React</h1>';

        // // Llama a la función print con el contenido que deseas imprimir
        // print(contentToPrint);
    };

    return (
        <div>
            <button onClick={handlePrint}>Print</button>
        </div>
    );
};

export default TestPrint;