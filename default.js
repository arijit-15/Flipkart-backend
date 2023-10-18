 import { products } from "./constants/data.js"
 import Product from "./model/product-schema.js";

const DefaultData = async() =>{
  try{
    await Product.deleteMany({});
   await Product.insertMany(products);
   console.log('Data imported successfully');
  }catch(error){
    console.log('Error while inserting data',error.message);
  }
}

// export default DefaultData;
// import { products } from "./constants/data.js";
// import Product from "./model/product-schema.js";

// const batchSize = 100; // Set an appropriate batch size

// const deleteDataInBatches = async () => {
//   try {
//     let offset = 0;
//     let deletedCount = 0;

//     while (true) {
//       const result = await Product.deleteMany({}).skip(offset).limit(batchSize);
//       deletedCount += result.deletedCount;

//       if (result.deletedCount === 0) {
//         break; // No more documents to delete
//       }

//       offset += batchSize;
//     }

//     console.log(`Deleted ${deletedCount} documents successfully`);
//   } catch (error) {
//     console.log('Error while deleting data', error.message);
//   }
// };

// const DefaultData = async () => {
//   try {
//     // Delete data in batches
//     await deleteDataInBatches();

//     // Insert new data
//     await Product.insertMany(products);
//     console.log('Data imported successfully');
//   } catch (error) {
//     console.log('Error while inserting data', error.message);
//   }
// };

export default DefaultData;
