
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
   "https://product-f170e.web.app",
   "https://product-f170e.firebaseapp.com"

 ],
 credentials: true
}));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.obyjfl3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db('productDb').collection('allProducts');

    // Endpoint to get all products with sorting options
    // app.get('/allProducts', async (req, res) => {
    //   const sortOption = req.query.sort;

    //   let sortQuery = {};
    //   if (sortOption === 'priceLowToHigh') {
    //     sortQuery = { price: 1 };
    //   } else if (sortOption === 'priceHighToLow') {
    //     sortQuery = { price: -1 };
    //   } else if (sortOption === 'newestFirst') {
    //     sortQuery = { product_creation_date: -1 };
    //   }

    //   const cursor = productCollection.find().sort(sortQuery);
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });

    app.get('/allProducts', async (req, res) => {
      const { sort, brandname, category, minPrice, maxPrice } = req.query;
    
      let filterQuery = {};
    
      // Apply brand filter if provided
      if (brandname) {
        filterQuery.brandname = { $regex: new RegExp(brandname, 'i') }; // Case-insensitive match
      }
    
      // Apply category filter if provided
      if (category) {
        filterQuery.category = { $regex: new RegExp(category, 'i') }; // Case-insensitive match
      }
    
      // Apply price range filter if provided
      if (minPrice || maxPrice) {
        filterQuery.price = {};
        if (minPrice) {
          filterQuery.price.$gte = parseFloat(minPrice);
        }
        if (maxPrice) {
          filterQuery.price.$lte = parseFloat(maxPrice);
        }
      }
    
      // Sort options
      let sortQuery = {};
      if (sort === 'priceLowToHigh') {
        sortQuery = { price: 1 };
      } else if (sort === 'priceHighToLow') {
        sortQuery = { price: -1 };
      } else if (sort === 'newestFirst') {
        sortQuery = { product_creation_date: -1 };
      }
    
      const cursor = productCollection.find(filterQuery).sort(sortQuery);
      const result = await cursor.toArray();
      res.send(result);
    });
    


  app.get('/ProductsCount', async(req,res) =>{
    const count = await productCollection.estimatedDocumentCount()
    res.send({count});
  })
  

    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Product server is running');
});

app.listen(port, () => {
  console.log(`Product server is running on port ${port}`);
});





// const express = require('express');
// const cors = require('cors');
// const { MongoClient, ServerApiVersion } = require('mongodb');
// require('dotenv').config();
// const app = express();

// const port = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.obyjfl3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server (optional starting in v4.7)
//     await client.connect();

//     const productCollection = client.db('productDb').collection('allProducts');

//     // Endpoint to get all products with sorting options
//     // app.get('/allProducts', async (req, res) => {
//     //   const sortOption = req.query.sort;

//     //   let sortQuery = {};
//     //   if (sortOption === 'priceLowToHigh') {
//     //     sortQuery = { price: 1 };
//     //   } else if (sortOption === 'priceHighToLow') {
//     //     sortQuery = { price: -1 };
//     //   } else if (sortOption === 'newestFirst') {
//     //     sortQuery = { product_creation_date: -1 };
//     //   }

//     //   const cursor = productCollection.find().sort(sortQuery);
//     //   const result = await cursor.toArray();
//     //   res.send(result);
//     // });

//     //ph
  //   app.get('/allProducts', async (req, res) => {
  //     const page = parseInt(req.query.page);
  //     const size = parseInt(req.query.size);
  //     console.log('pag query', page, size);
  //     const { sort, brandname, category, minPrice, maxPrice } = req.query;
  
  //     let filterQuery = {};
  
  //     // Apply brand filter if provided
  //     if (brandname) {
  //         filterQuery.brandname = brandname;
  //     }
  
  //     // Apply category filter if provided
  //     if (category) {
  //         filterQuery.category = category;
  //     }
  
  //     // Apply price range filter if provided
  //     if (minPrice || maxPrice) {
  //         filterQuery.price = {};
  //         if (minPrice) {
  //             filterQuery.price.$gte = parseFloat(minPrice);
  //         }
  //         if (maxPrice) {
  //             filterQuery.price.$lte = parseFloat(maxPrice);
  //         }
  //     }
  
  //     // Sort options
  //     let sortQuery = {};
  //     if (sort === 'priceLowToHigh') {
  //         sortQuery = { price: 1 };
  //     } else if (sort === 'priceHighToLow') {
  //         sortQuery = { price: -1 };
  //     } else if (sort === 'newestFirst') {
  //         sortQuery = { product_creation_date: -1 };
  //     }
  
  //     const cursor = productCollection.find(filterQuery).skip(page * size).limit(size).sort(sortQuery);
  //     const result = await cursor.toArray();
  //     res.send(result);
  // });



//   //gpt
// //   app.get('/allProducts', async (req, res) => {
// //     const { sort, brandname, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

// //     let filterQuery = {};

// //     // Apply brand filter if provided
// //     if (brandname) {
// //         filterQuery.brandname = brandname;
// //     }

// //     // Apply category filter if provided
// //     if (category) {
// //         filterQuery.category = category;
// //     }

// //     // Apply price range filter if provided
// //     if (minPrice || maxPrice) {
// //         filterQuery.price = {};
// //         if (minPrice) {
// //             filterQuery.price.$gte = parseFloat(minPrice);
// //         }
// //         if (maxPrice) {
// //             filterQuery.price.$lte = parseFloat(maxPrice);
// //         }
// //     }

// //     // Sort options
// //     let sortQuery = {};
// //     if (sort === 'priceLowToHigh') {
// //         sortQuery = { price: 1 };
// //     } else if (sort === 'priceHighToLow') {
// //         sortQuery = { price: -1 };
// //     } else if (sort === 'newestFirst') {
// //         sortQuery = { product_creation_date: -1 };
// //     }

// //     // Pagination options
// //     const options = {
// //         skip: (page - 1) * limit,
// //         limit: parseInt(limit),
// //     };

// //     const cursor = productCollection.find(filterQuery).sort(sortQuery).skip(options.skip).limit(options.limit);
// //     const result = await cursor.toArray();
    
// //     const totalProducts = await productCollection.countDocuments(filterQuery);
// //     const totalPages = Math.ceil(totalProducts / limit);

// //     res.send({
// //         totalProducts,
// //         totalPages,
// //         currentPage: parseInt(page),
// //         products: result,
// //     });
// // });



//   app.get('/ProductsCount', async(req,res) =>{
//     const count = await productCollection.estimatedDocumentCount()
//     res.send({count});
//   })
  

//     // Send a ping to confirm a successful connection
//     await client.db('admin').command({ ping: 1 });
//     console.log('Pinged your deployment. You successfully connected to MongoDB!');
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//   res.send('Product server is running');
// });

// app.listen(port, () => {
//   console.log(`Product server is running on port ${port}`);
// });
