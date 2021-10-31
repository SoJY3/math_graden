
var model;

var processing_imported=true


async function loadModel() {


    model = await tf.loadGraphModel('TFJS/model.json')

}

console.log(loadModel);
console.log('Model defined');

function predictImage() {

    console.log('Processing...');

    let image = cv.imread(canvas);

    cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(image, image, 150, 255, cv.THRESH_BINARY);

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    let cnt = contours.get(0);          //get contour form contours
    let rect = cv.boundingRect(cnt);    //make a bounding rect
    image = image.roi(rect);            //get the region of interest.

    var height = image.rows;
    var width = image.cols;

    if (height > width) {

        height = 20;
        const scalefactor = image.rows / height;
        width = Math.round(image.cols / scalefactor);
    }
    else {

        width = 20;
        const scalefactor = image.cols / width;
        height = Math.round(image.rows / scalefactor);
    }

    let dsize = new cv.Size(width, height);
    cv.resize(image, image, dsize, 0, 0, cv.INTER_AREA);

    const LEFT = Math.ceil(4 + (20 - width) / 2);  //we have scaled it equally therefore left and right padding are same.
    const RIGHT = Math.floor(4 + (20 - width) / 2);

    const TOP = Math.ceil(4 + (20 - height) / 2);
    const BOT = Math.floor(4 + (20 - height) / 2);

    console.log(`top : ${TOP} bot : ${BOT} left : ${LEFT} right : ${RIGHT}`);

    const s = new cv.Scalar(0, 0, 0, 0);
    cv.copyMakeBorder(image, image, TOP, BOT, LEFT, RIGHT, cv.BORDER_CONSTANT, s);

    //centre of mass

    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    const moments = cv.moments(cnt, false);

    const cx = moments.m10 / moments.m00;
    const cy = moments.m01 / moments.m00;

    console.log(`M00 :${moments.m00} cx :${cx} cy :${cy}`);

    const x_shift = Math.round(image.cols / 2 - cx);
    const y_shift = Math.round(image.rows / 2 - cy);

    let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, x_shift, 0, 1, y_shift]);
    let newsize = new cv.Size(image.rows, image.cols);

    // You can try more different parameters
    cv.warpAffine(image, image, M, newsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, s);

    //updating pixel value

    let pixelValue = image.data;

    pixelValue = Float32Array.from(pixelValue);

    pixelValue = pixelValue.map(function (item) {

        return item/255.0;

    });

    console.log(`pixel value : ${pixelValue}`);

    //prediction (main)

    const X = tf.tensor([pixelValue]);
    console.log(`shape of tensor : ${X.shape}`);
    console.log(`data type of tensor : ${X.dtype}`);

    const result = model.predict(X);
    result.print();

    const output = result.dataSync();

    console.log(`output : ${output[0]}`);

    //testing canvas(delete later)

    // const outputCanvas = document.createElement('CANVAS');
    // cv.imshow(outputCanvas, image);

    // document.body.appendChild(outputCanvas); //wow pretty cool



    //cleanup

    image.delete();
    contours.delete();
    cnt.delete();
    hierarchy.delete();
    M.delete();
    X.dispose();
    result.dispose();

    return output[0];


}