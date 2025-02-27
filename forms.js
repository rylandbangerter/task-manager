// storage for form data?
document.getElementById('statsQueryForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission 
    let responseJson = {};
    // Example of sending form data to an API
    fetch('https://localhost:44347/SwingSaver/GetPlayerStats/' + this[0].value + '/' + this[1].value, {
        method: 'GET',
    })
    .then(response => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder(); // Decodes Uint8Array chunks into strings

        return reader.read().then(function processText({ done, value }) {
            if (done) {
                console.log('Stream complete');
                console.log('Response JSON:', responseJson);

                // Render the found player stats or an empty table
                renderPlayerStats(responseJson);

                return;
            }

            // Decode the Uint8Array chunk to a string
            const chunk = decoder.decode(value, { stream: true });
            responseJson = JSON.parse(chunk);
            console.log('Received chunk:', chunk);

            // Continue reading the stream
            return reader.read().then(processText);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
});