# plugin-image-linker

This plugin allows you to link your image to your product by changing its name to match this pattern
```
Pattern:
[newFileNamePrefix]_[newFileNameSuffix].[CurrentFileExtension]

Example:
adidas_tee_red_5d25818f-51be-49ec-8d52-3231e9949fb0.webp
```
Prefix might be a product title or id, for suffix i suggest to use uuid or something like that.


## How to use it

1) Create a collection of products of your kind.
2) Create a upload field to store a preview or other images for your product.
3) Add **image-linker** dependecy into package.json
```
  "dependencies": {
    ...
    "imageLinker": "git@github.com:Ryeori/plugin-image-linker.git"
  },

```
4) Add plugin into payload.config.ts
```
import { imageLinker } from "imageLinker";



```
5) Add a **afterChange** hook where you will retrieve your image/images id's and checks wether its changed or not by
```
//Get ours image **id** field
let imageId: string = args.data.preview?.id ?? args.data.preview;

// Check if data is presented and if it's changed or not with comparison to previous doc
if (
  Boolean(args.data.preview) &&
  args.data.preview != args.previousDoc.preview
) {

  //Calls our function to update upload
  await updateImagesNameAndPath({
    //Provide list of image id's that we need to update
    currentImages: [imageId],
    
    //Prefix to match product id/title
    newFileNamePrefix: args.data.productId,
    
    //Links an image by creating "relationship" field in it and references to our product
    documentLinkToId: args.previousDoc.id ?? args.originalDoc.id,
    
    //Collection where we store our images (use yarn generate:types to be aware of changes in names)
    collection: "products-media",
    
    //Suffix to make every update image unique, i suppose you will use uuid or provide anything taht you want
    newFileNameSuffix: uuidv4(),
  });
}
```
