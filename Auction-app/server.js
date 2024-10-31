const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Set up Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Serve static files

// Route for auctioneer page
app.get('/auctioneer', (req, res) => {
    res.sendFile(__dirname + '/public/auctioneer.html');
  });
  
  // Route for bidder page
  app.get('/bidder', (req, res) => {
    res.sendFile(__dirname + '/public/bidder.html');
  });
  

// Auction-related state
let currentAuction = null;
let bids = [];  // Empty array for tracking bids

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Auctioneer starts an auction
  socket.on('startAuction', (auctionData) => {
    currentAuction = {
      ...auctionData,
      highestBid: auctionData.startPrice,
      highestBidder: 'Auctioneer',
      bids: []
    };
    bids = [];
    io.emit('auctionStarted', currentAuction); // Notify all bidders
  });

  // Bidders place new bids
  socket.on('newBid', (bidData) => {
    if (bidData.price > currentAuction.highestBid) {
      currentAuction.highestBid = bidData.price;
      currentAuction.highestBidder = bidData.name;
      currentAuction.bids.push(bidData);
      io.emit('bidUpdate', { highestBid: bidData.price, highestBidder: bidData.name });
    } else {
      socket.emit('bidTooLow');
    }
  });

  // End of auction
  socket.on('endAuction', () => {
    io.emit('auctionEnded', { winner: currentAuction.highestBidder, price: currentAuction.highestBid });
    currentAuction = null;
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
