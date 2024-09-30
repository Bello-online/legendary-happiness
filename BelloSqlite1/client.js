const axios = require('axios');

async function runTests() {
    try {
        // Test #1: Add two movies
        await axios.post('http://localhost:3000/api', { title: 'Despicable Me', release_year: '2010', time_viewed: '2024-01-01T10:00:00' });
        await axios.post('http://localhost:3000/api', { title: 'Batman Origins', release_year: '1999', time_viewed: '2024-01-02T12:00:00' });

        // Modify a movie
        await axios.put('http://localhost:3000/api/1', { title: 'Despicable Me Updated', release_year: '2010', time_viewed: '2024-01-03T15:00:00' });

        // Get and check each movie
        const movie1 = await axios.get('http://localhost:3000/api/1');
        const movie2 = await axios.get('http://localhost:3000/api/2');
        console.log(movie1.data);
        console.log(movie2.data);

        // Test #2: Replace the collection
        await axios.put('http://localhost:3000/api', [
            { title: 'The Dark Knight', release_year: '2008', time_viewed: '2024-01-04T10:00:00' },
            { title: 'Pulp Fiction', release_year: '1994', time_viewed: '2024-01-05T14:00:00' },
            { title: 'Interstellar', release_year: '2014', time_viewed: '2024-01-06T17:00:00' },
            { title: 'The Shawshank Redemption', release_year: '1994', time_viewed: '2024-01-07T20:00:00' }
        ]);

        // Check the replaced collection
        const collection1 = await axios.get('http://localhost:3000/api');
        console.log(collection1.data);

        // Delete a single item
        await axios.delete('http://localhost:3000/api/2');

        // Check the collection after deletion
        const collection2 = await axios.get('http://localhost:3000/api');
        console.log(collection2.data);

        // Delete the entire collection
        await axios.delete('http://localhost:3000/api');

        // Check the empty collection
        const emptyCollection = await axios.get('http://localhost:3000/api');
        console.log(emptyCollection.data);

        console.log("ALL TESTS SUCCESSFUL");
    } catch (err) {
        console.error("Test failed", err.message);
    }
}

runTests();
