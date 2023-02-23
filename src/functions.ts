import * as fs from "fs";
import payload from "payload";
import { Config as GeneratedTypes } from "payload/generated-types";

export const updateImagesNameAndPath = (args: {
  /**List of current images*/
  currentImages: string[];

  /**List of previous images*/
  // previousImages: string[];

  /**A collection refecrence generated by [yarn generate:types] where you store your media uploads
   */
  collection: keyof GeneratedTypes["collections"];

  /**Could be a product id or title
   * it will replace default name of the upload to [newFileNamePrefix]_[newFileNameSuffix].[CurrentFileExtension]
   */

  newFileNamePrefix: string;

  /**Could be a uuid or something like that
   * it will replace default name of the upload to [newFileNamePrefix]_[newFileNameSuffix].[CurrentFileExtension]
   */

  newFileNameSuffix: string;

  /**An ID to link image upload to your product document or something like that
   */
  documentLinkToId: string;
}) => {
  if (args.currentImages.length > 0) {
    args.currentImages.forEach(async (currentImage: string) => {
      await updateImageNameAndPath({
        collection: args.collection,
        currentImageRefId: currentImage,
        documentLinkToId: args.documentLinkToId,
        newFileNamePrefix: args.newFileNamePrefix,
        newFileNameSuffix: args.newFileNameSuffix,
      });
    });
  }
};

async function updateImageNameAndPath(args: {
  currentImageRefId: string;
  documentLinkToId: string;
  newFileNamePrefix: string;
  newFileNameSuffix: string;
  collection: keyof GeneratedTypes["collections"];
}) {
  try {
    //If {'id':id, image:string|[]} is not empty

    if (Boolean(args.currentImageRefId)) {
      const rootImage = await payload.findByID({
        collection: args.collection,
        id: args.currentImageRefId,
      });

      await updateUploadFileAndDocument({
        documentLinkToId: args.documentLinkToId,
        newFileNamePrefix: args.newFileNamePrefix,
        newFileNameSuffix: args.newFileNameSuffix,
        rootImage: rootImage,
        collection: args.collection,
      });
    } else {
      //Here could be logic to delete an image when its unlinked
    }
  } catch (error) {
    console.log(`updateImageNameAndPath error\n\n${error}`);
  }
}

async function updateUploadFileAndDocument(args: {
  rootImage: any;
  newFileNamePrefix: string;
  newFileNameSuffix: string;
  documentLinkToId: string;
  collection: keyof GeneratedTypes["collections"];
}) {
  try {
    args.rootImage.linkTo = args.documentLinkToId;

    const currentFileName: string = args.rootImage.url.substring(
      args.rootImage.url.lastIndexOf("/") + 1
    );

    const imageExtension: string = currentFileName.split(".")[1];

    const newFileName: string = `${args.newFileNamePrefix}_${args.newFileNameSuffix}.${imageExtension}`;

    const newFilePath: string = `src/${args.collection.toString()}/${newFileName}`;

    fs.renameSync(
      `src/${args.collection.toString()}/${currentFileName}`,
      newFilePath
    );

    await payload.update({
      collection: args.collection,
      id: args.rootImage.id,
      data: { ...args.rootImage, filename: newFileName },
      filePath: newFilePath,
      overwriteExistingFiles: true,
    });
  } catch (error) {
    console.log(`updateUploadFileAndDocument error\n\n${error}`);
  }
}