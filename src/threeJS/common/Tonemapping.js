


import * as THREE from "three";

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
// 表情管理
class Tonemapping {
    constructor(renderer,scene) {
        let scope = this;
        const params = {
            exposure: 1.0,
            toneMapping: 'ACESFilmic',
            blurriness: 0.3,
            intensity: 1.0,
        };
        const toneMappingOptions = {
            None: THREE.NoToneMapping,
            Linear: THREE.LinearToneMapping,
            Reinhard: THREE.ReinhardToneMapping,
            Cineon: THREE.CineonToneMapping,
            ACESFilmic: THREE.ACESFilmicToneMapping,
            AgX: THREE.AgXToneMapping,
            Neutral: THREE.NeutralToneMapping,
            Custom: THREE.CustomToneMapping
        };
        
	    let gui, guiExposure = null;
        function initGui() { 
            THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(

                'vec3 CustomToneMapping( vec3 color ) { return color; }',

                `#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )

                float toneMappingWhitePoint = 1.0;

                vec3 CustomToneMapping( vec3 color ) {
                    color *= toneMappingExposure;
                    return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );

                }`

            );
            
			scene.backgroundBlurriness = params.blurriness;

            gui = new GUI();
            const toneMappingFolder = gui.addFolder('tone mapping');

            toneMappingFolder.add(params, 'toneMapping', Object.keys(toneMappingOptions))

                .onChange(function () {

                    updateGUI(toneMappingFolder);

                    renderer.toneMapping = toneMappingOptions[params.toneMapping];
                    render();


                });
                const backgroundFolder = gui.addFolder( 'background' );

				backgroundFolder.add( params, 'blurriness', 0, 1 )

					.onChange( function ( value ) {

						scene.backgroundBlurriness = value;
						render();

					} );

				backgroundFolder.add( params, 'intensity', 0, 1 )

					.onChange( function ( value ) {

						scene.backgroundIntensity = value;
						render();

					} );
        }
        function render(){
            _Global.YJ3D.renderScene();
        }
        function updateGUI( folder ) {

            if ( guiExposure !== null ) {

                guiExposure.destroy();
                guiExposure = null;

            }

            if ( params.toneMapping !== 'None' ) {

                guiExposure = folder.add( params, 'exposure', 0, 2 )

                    .onChange( function () {

                        renderer.toneMappingExposure = params.exposure;
                        render();
                    } );

            }

        }
        initGui();
    }
}
export { Tonemapping };