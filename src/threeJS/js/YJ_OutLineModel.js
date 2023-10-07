/*
* 选中模型脚本
* 模型外轮廓高亮 同时颜色变色
*
* */
//*


document.write("<script type='text/javascript' src='js/three/Detector.js'></script>");
document.write("<script type='text/javascript' src='js/three/shaders/CopyShader.js'></script>");
document.write("<script type='text/javascript' src='js/three/shaders/FXAAShader.js'></script>");
document.write("<script type='text/javascript' src='js/three/postprocessing/EffectComposer.js'></script>");
document.write("<script type='text/javascript' src='js/three/postprocessing/RenderPass.js'></script>");
document.write("<script type='text/javascript' src='js/three/postprocessing/ShaderPass.js'></script>");
document.write("<script type='text/javascript' src='js/three/postprocessing/OutlinePass.js'></script>");

var composer, effectFXAA, outlinePass;
var selectedObjects = [];
function init_outline(){
    // postprocessing
    console.log(" in outline " );

    composer = new THREE.EffectComposer( renderer );

    var renderPass = new THREE.RenderPass( scene, camera );
    composer.addPass( renderPass );

    outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
    composer.addPass( outlinePass );

    var onLoad = function ( texture ) {

        outlinePass.patternTexture = texture;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

    };

    var loader = new THREE.TextureLoader();

    loader.load( 'images/tri_pattern.jpg', onLoad );

    effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
    effectFXAA.renderToScreen = true;
    composer.addPass( effectFXAA );

   // window.addEventListener( 'resize', onWindowResize, false );

    window.addEventListener( 'mousemove', onTouchMove );
    window.addEventListener( 'touchmove', onTouchMove );

    animate_outline();
    function onTouchMove( event ) {

        var x, y;

        if ( event.changedTouches ) {

            x = event.changedTouches[ 0 ].pageX;
            y = event.changedTouches[ 0 ].pageY;

        } else {

            x = event.clientX;
            y = event.clientY;

        }

        mouse.x = ( x / window.innerWidth ) * 2 - 1;
        mouse.y = - ( y / window.innerHeight ) * 2 + 1;

        checkIntersection();

    }

    function addSelectedObject( object ) {

        selectedObjects = [];
        selectedObjects.push( object );

    }

    function checkIntersection() {

        raycaster.setFromCamera( mouse, camera );

        var intersects = raycaster.intersectObjects( [ scene ], true );

        if ( intersects.length > 0 ) {

            var selectedObject = intersects[ 0 ].object;
            addSelectedObject( selectedObject );
            outlinePass.selectedObjects = selectedObjects;

        } else {

            // outlinePass.selectedObjects = [];

        }

    }


}
function animate_outline() {
    requestAnimationFrame( animate_outline );
    composer.render();
}