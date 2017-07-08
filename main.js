function init(){
    var scene = new THREE.Scene();
    
    var gui = new dat.GUI();
    var clock = new THREE.Clock();
    
    var enableFog = true;
    
    if(enableFog){
        scene.fog = new THREE.FogExp2(0xffffff, 0.1);
    }
    
    var directionalLight = getDirectionalLight(1);
    var sphere = getSphere(0.05);
    var boxGrid = getBoxGrid(20, 2.5);
    boxGrid.name = 'boxgrid'
    var plane = getPlane(100);
    var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
    
    
    directionalLight.position.x = 13;
    directionalLight.position.y = 10;
    directionalLight.position.z = 10;
    directionalLight.add(sphere);
    directionalLight.intensity = 2;
    
//    gui.add(directionalLight, 'intensity', 0, 10);
//    gui.add(directionalLight.position, 'x', 0, 20);
//    gui.add(directionalLight.position, 'y', 0, 20);
//    gui.add(directionalLight.position, 'z', 0, 20);
    
    
    plane.rotation.x = Math.PI/2;
    
    
    plane.name = 'plane-1';
    
    
    scene.add(boxGrid);
    scene.add(plane);
    scene.add(directionalLight);
    //scene.add(helper);
    
    var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth/window.innerHeight,
        1,
        1000
    );
    
    var cameraYPosition = new THREE.Group();
    var cameraZRotation = new THREE.Group();
    var cameraZPosition = new THREE.Group();
    var cameraXRotation = new THREE.Group();
    var cameraYRotation = new THREE.Group();
    
    
    cameraYPosition.name = 'cameraYPosition';
    cameraZRotation.name = 'cameraZRotation';
    cameraZPosition.name = 'cameraZPosition';
    cameraXRotation.name = 'cameraXRotation';
    cameraYRotation.name = 'cameraYRotation';
    
    cameraYPosition.add(camera);
    cameraZRotation.add(cameraYPosition);
    cameraZPosition.add(cameraZRotation);
    cameraXRotation.add(cameraZPosition);
    cameraYRotation.add(cameraXRotation);
    scene.add(cameraYRotation);
    
    cameraZPosition.position.z = 100;
    cameraYPosition.position.y = 1;
    cameraXRotation.rotation.x = - Math.PI/2;
    
    
    new TWEEN.Tween({val : 100})
    .to({val : -50}, 12000)
    .onUpdate(function(){
        cameraZPosition.position.z = this.val;
    })
    .start();
    
    new TWEEN.Tween({val : -Math.PI/2})
    .to({val : 0}, 6000)
    .delay(1000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(function(){
        cameraXRotation.rotation.x = this.val;
    })
    .start();
    
    new TWEEN.Tween({val : -Math.PI/2})
    .to({val : 0}, 6000)
    .delay(1000)
    .onUpdate(function(){
        cameraYRotation.rotation.y = this.val;
    })
    .start();
    
    
    
    gui.add(cameraZPosition.position, 'z', 0, 100);
    gui.add(cameraXRotation.rotation, 'x', - Math.PI, Math.PI);
    gui.add(cameraYRotation.rotation, 'y', - Math.PI, Math.PI);
    gui.add(cameraYRotation.rotation, 'z', - Math.PI, Math.PI);
    
    
//    var camera = new THREE.OrthographicCamera(
//        -15,
//        15,
//        15,
//        -15,
//        1,
//        1000
//    );
    
//    camera.position.x = 1;
//    camera.position.y = 2;
//    camera.position.z = 5;
//    camera.lookAt(new THREE.Vector3(0,0,0));
    
    
    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('webgl').appendChild(renderer.domElement);
    renderer.setClearColor('rgb(120,120,120)');
    
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    var composer = new THREE.EffectComposer(renderer);
    var renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    
    var vignetteEffect = new THREE.ShaderPass(THREE.VignetteShader);
    vignetteEffect.uniforms['darkness'].value = 2;
    composer.addPass(vignetteEffect);
    
    var rgbShiftEffect = new THREE.ShaderPass(THREE.RGBShiftShader);
    rgbShiftEffect.uniforms['amount'].value = 0.003;
    rgbShiftEffect.renderToScreen = true;
    composer.addPass(rgbShiftEffect);
    
    
    
    update(composer, scene, camera, controls, clock);
    
    return scene;
}

function getBox(w, h, d){
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshPhongMaterial({
        color : 'rgb(120,120,120)'
    });
    
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    
    mesh.castShadow = true;
    return mesh;
}

function getSphere(size){
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    var material = new THREE.MeshBasicMaterial({
        color : 'rgb(255,255,255)'
    });
    
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    return mesh;
}

function getPointLight(intensity){
    var light = new THREE.PointLight( 'rgb(255,255,255)' ,intensity);
    light.castShadow = true;  
    
    return light;
}

function getAmbientLight(intensity){
    var light = new THREE.AmbientLight( 'rgb(10,30,50)' ,intensity);
    
    return light;
}

function getDirectionalLight(intensity){
    var light = new THREE.DirectionalLight( 'rgb(255,255,255)' ,intensity);
    light.castShadow = true;  
    
    light.shadow.camera.left = -40;
    light.shadow.camera.bottom = -40;
    light.shadow.camera.right = 40;
    light.shadow.camera.top = 40;
    
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    
    return light;
}

function getSpotLight(intensity){
    var light = new THREE.SpotLight( 'rgb(255,255,255)' ,intensity);
    light.castShadow = true;  
    
    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    
    return light;
}

function getBoxGrid(amount, seperationMultiplier){
    var group = new THREE.Group();
    
    for(var i = 0; i < amount; i++){
        var obj = getBox(1,2,1);
        obj.position.x = i * seperationMultiplier;
        obj.position.y = obj.geometry.parameters.height/2;
        group.add(obj);
        
        for(var j = 0; j < amount; j++){
            var obj = getBox(1,2,1);
            obj.position.x = i * seperationMultiplier;
            obj.position.y = obj.geometry.parameters.height/2;
            obj.position.z = j * seperationMultiplier;
            group.add(obj);
        }
    }
    
    
    group.position.x = -(seperationMultiplier * (amount - 1))/2;
    group.position.z = -(seperationMultiplier * (amount - 1))/2;
    
    return group;
}

function getPlane(size){
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshPhongMaterial({
        color : 'rgb(120,120,120)',
        side : THREE.DoubleSide
    });
    
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    
    mesh.receiveShadow = true;
    return mesh;
}

function update(renderer, scene, camera, controls, clock){
    renderer.render(
        scene,
        camera
    );
    
    var elapsedTime = clock.getElapsedTime();
    controls.update();
    TWEEN.update();
    
    
    var cameraXRotation = scene.getObjectByName('cameraXRotation');
    if(cameraXRotation.rotation.x < 0){
        cameraXRotation.rotation.x += 0.01;
    }
    
    
    
    var boxGrid = scene.getObjectByName('boxgrid');
    
    boxGrid.children.forEach(function(child,index){
        
        var x = elapsedTime * 5 + index;
        child.scale.y = (noise.simplex2(x, x) + 1) / 2 + 0.001;
        child.position.y = child.scale.y/2;
    });
    
    requestAnimationFrame(function(){
        update(renderer, scene, camera, controls, clock);
    });
}

var scene = init();
