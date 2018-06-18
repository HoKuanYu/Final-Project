var manager = new THREE.LoadingManager();
var plane, cactus, bush, bomb, tank1, tank2, backGround;
var shoot1 = true, shoot2 = true;
var cannon1 = [], cannon2 = [];
var bombs = [], bombsDist = [];
var scene, camera1, camera2, renderer1, renderer2;
var plant = [];
var key_pressed = [];
var life1 = 100, life2 = 100;
var refresh = true;
var bombSound1 = document.getElementById("bombSound1");
var bombSound2 = document.getElementById("bombSound2");
var time = 300;
initial();
//載入畫面
manager.onProgress = function(object, item, total){
    value = parseInt(item / total * 100);
    $("#loading").html(value + "%");
};
manager.onLoad = function(){
    start();
    $("#container").remove();
    $("#canvas1").width("50%");
    $("#canvas2").width("50%");
    $("#canvas1").height("100%");
    $("#canvas2").height("100%");
    $("#life1").show();
    $("#life2").show();
    $("#time").show();
    $("#timeImg").show();
};
function createSkybox() {
    value = Math.floor(Math.random() * 3);
    if(value === 0)
        urlPath = "model/night/";
    else if(value === 1)
        urlPath = "model/morning/";
    else
        urlPath = "model/evening/";
    urls = [urlPath + "ft.jpg", urlPath + "bk.jpg", urlPath + "up.jpg"
            , urlPath + "dn.jpg", urlPath + "rt.jpg", urlPath + "lf.jpg"];
    textureCube = new THREE.CubeTextureLoader(manager).load(urls);
    shader = THREE.ShaderLib["cube"];
    shader.uniforms["tCube"].value = textureCube;
    material = new THREE.ShaderMaterial({
        fragmentShader : shader.fragmentShader,
        vertexShader : shader.vertexShader,
        uniforms : shader.uniforms,
        depthWrite : false,
        side : THREE.BackSide
    });
    backGround = new THREE.Mesh(new THREE.CubeGeometry(500, 500, 500), material);
}
//創造坦克
function createTank(){
    new THREE.MTLLoader(manager).load("model/tank/sprut.mtl", function(materials){
        materials.preload();
        loader = new THREE.OBJLoader(manager);
        loader.setMaterials(materials);
        loader.load("model/tank/sprut.obj", function(object){
            object.scale.set(0.024, 0.019, 0.019);
            tank1 = object.clone();
            tank2 = object.clone();
            tank1.position.set(0, 0, -100);
            tank2.position.set(0, 0, 100);
            tank1.rotation.y = Math.PI;
            cannon1.push(tank1.children[1]);
            cannon2.push(tank2.children[1]);
            cannon1.push(tank1.children[2]);
            cannon2.push(tank2.children[2]);
            cannon1.push(tank1.children[3]);
            cannon2.push(tank2.children[3]);
            cannon1.push(tank1.children[4]);
            cannon2.push(tank2.children[4]);
        });
    });
}
//創造場景()
function createScene(){
    var texture = new THREE.TextureLoader(manager).load('grass.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(80, 80);
    var material = new THREE.MeshBasicMaterial({map:texture, side:THREE.DoubleSide});
    var geometry = new THREE.PlaneGeometry(500,500,10,10);
    plane = new THREE.Mesh(geometry, material);
    plane.position.y = -0.5;
    plane.rotation.x = Math.PI/2;
}
//創造仙人掌
function createCactus(){
    loader = new THREE.OBJLoader(manager);
    loader.load("model/Cactus/cactus.obj", function(object){
        var texture = new THREE.TextureLoader().load('model/Cactus/cactus_texture.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        object.traverse(function(child){ 
            if(child instanceof THREE.Mesh){
                child.material.map = texture;
            }
        });
        cactus = object;
    });
}
//創造灌木叢
function createBush(){
    new THREE.MTLLoader(manager).load("model/Bush/Bush1.mtl", function(materials){
        materials.preload();
        loader = new THREE.OBJLoader(manager);
        loader.setMaterials(materials);
        loader.load("model/Bush/Bush1.obj", function(object){
            bush = object;
        });
    });
}
//創造植物
function createScreen(){
    var plantPos = [];
    for(var i = 0; i < 130; i++){
        pos = new THREE.Vector3(Math.random() * 470 - 235, 0, Math.random() * 470 - 235);
        for(var j = 0; j < i; j++){
            while(!(Math.abs(pos.x - plantPos[j].x) > 5 && Math.abs(pos.z - plantPos[j].z) > 5)){
                pos = new THREE.Vector3(Math.random() * 470 - 235, 0, Math.random() * 470 - 235);
            }
        }
        plantPos[i] = pos;
        var choice = Math.floor(Math.random() * 2);
        var temp;
        if(choice === 0){
            scale = Math.random() * 1.8 + 0.3;
            temp = cactus.clone();
            temp.scale.set(scale, scale, scale);
            temp.position.copy(pos);
        }
        else if(choice === 1){
            scale = Math.random() * 2.5 + 0.6;
            temp = bush.clone();
            temp.scale.set(scale, scale, scale);
            temp.position.copy(pos);
        }
        temp.rotation.y = Math.floor(Math.random() * Math.PI * 2);
        plant.push(temp);
        scene.add(temp);
    }
}
//創造炸彈
function createBomb(){
    var texture = new THREE.TextureLoader(manager).load('cannonBall.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(0.5, 0.5);
    var material = new THREE.MeshBasicMaterial({map:texture, side:THREE.DoubleSide});
    var geometry = new THREE.SphereGeometry(1.3, 30, 30);
    bomb = new THREE.Mesh(geometry, material);
    bomb.geometry.computeBoundingBox();
}
//載入物件
function initial(){
    createSkybox();
    createTank();
    createScene();
    createCactus();
    createBush();
    createBomb();
}
function start(){
    //創造場景
    scene = new THREE.Scene();
    //創造燈光
    light1 = new THREE.PointLight( 0xffffff, 0.6, 0 );
    light2 = new THREE.PointLight( 0xffffff, 0.6, 0 );
    light3 = new THREE.PointLight( 0xffffff, 0.6, 0 );
    light4 = new THREE.PointLight( 0xffffff, 0.6, 0 );
    light1.position.set( 600, 700, 600 );
    light2.position.set( 600, 700, -600 );
    light3.position.set( -600, 700, 600 );
    light4.position.set( -600, 700, -600 );
    scene.add(light1);
    scene.add(light2);
    scene.add(light3);
    scene.add(light4);
    //創造攝影機
    camera1 = new THREE.PerspectiveCamera( 90, window.innerWidth / 2 / window.innerHeight, 0.1, 1000 );
    camera2 = new THREE.PerspectiveCamera( 90, window.innerWidth / 2 / window.innerHeight, 0.1, 1000 );
    camera1.position.set(0, 6.9, -111.7);
    camera2.position.set(0, 6.9, 111.7);
    camera1.rotation.y = Math.PI;
    //創造渲染器
    renderer1 = new THREE.WebGLRenderer({antialias: true});
    renderer2 = new THREE.WebGLRenderer({antialias: true});
    renderer1.setSize(window.innerWidth / 2, window.innerHeight);
    renderer2.setSize(window.innerWidth / 2, window.innerHeight);
    document.getElementById("canvas1").appendChild( renderer1.domElement );
    document.getElementById("canvas2").appendChild( renderer2.domElement );
    scene.add(tank1);
    scene.add(tank2);
    scene.add(plane);
    scene.add(backGround);
    createScreen();
    animate();
}
//畫面大小更新
window.addEventListener("resize", function(){
    camera1.aspect = window.innerWidth / 2 / window.innerHeight;
    camera2.aspect = window.innerWidth / 2 / window.innerHeight;
    camera1.updateProjectionMatrix();
    camera2.updateProjectionMatrix();
    renderer1.setSize(window.innerWidth / 2, window.innerHeight);
    renderer2.setSize(window.innerWidth / 2, window.innerHeight);
})
//更新畫面顯示內容
function animate() {
    if(refresh){
        requestAnimationFrame(animate);
    }
    moveObject();
    renderer1.render(scene, camera1);
    renderer2.render(scene, camera2);
}
//移動物件
function moveObject(){
    //W
    if(key_pressed[87]){
        if(!(Math.abs(tank1.position.x - Math.sin(tank1.rotation.y) * 0.4) > 245 || Math.abs(tank1.position.z - Math.cos(tank1.rotation.y) * 0.4) > 245)){
            tank1.position.x -= Math.sin(tank1.rotation.y) * 0.4;
            tank1.position.z -= Math.cos(tank1.rotation.y) * 0.4;
        }
    }
    //8
    if(key_pressed[104]){
        if(!(Math.abs(tank2.position.x - Math.sin(tank2.rotation.y) * 0.4) > 245 || Math.abs(tank2.position.z - Math.cos(tank2.rotation.y) * 0.4) > 245)){
            tank2.position.x -= Math.sin(tank2.rotation.y) * 0.4;
            tank2.position.z -= Math.cos(tank2.rotation.y) * 0.4;
        }
    }
    //S
    if(key_pressed[83]){
        if(!(Math.abs(tank1.position.x + Math.sin(tank1.rotation.y) * 0.4) > 245 || Math.abs(tank1.position.z + Math.cos(tank1.rotation.y) * 0.4) > 245)){
            tank1.position.x += Math.sin(tank1.rotation.y) * 0.4;
            tank1.position.z += Math.cos(tank1.rotation.y) * 0.4;
        }
    }
    //5
    if(key_pressed[101]){
        if(!(Math.abs(tank2.position.x + Math.sin(tank2.rotation.y) * 0.4) > 245 || Math.abs(tank2.position.z + Math.cos(tank2.rotation.y) * 0.4) > 245)){
            tank2.position.x += Math.sin(tank2.rotation.y) * 0.4;
            tank2.position.z += Math.cos(tank2.rotation.y) * 0.4;
        }
    }
    //D
    if(key_pressed[68]){
        tank1.rotation.y -= Math.PI*0.01;
    }
    //6
    if(key_pressed[102]){
        tank2.rotation.y -= Math.PI*0.01;
    }
    //A
    if(key_pressed[65]){
        tank1.rotation.y += Math.PI*0.01;
    }
    //4
    if(key_pressed[100]){
        tank2.rotation.y += Math.PI*0.01;
    }
    //E
    if(key_pressed[69]){
        for(var key in cannon1){
            cannon1[key].rotation.y -= Math.PI * 0.01;
        }
    }
    //9
    if(key_pressed[105]){
        for(var key in cannon2){
            cannon2[key].rotation.y -= Math.PI * 0.01;
        }
    }
    //Q
    if(key_pressed[81]){
        for(var key in cannon1){
            cannon1[key].rotation.y += Math.PI * 0.01;
        }
    }
    //7
    if(key_pressed[103]){
        for(var key in cannon2){
            cannon2[key].rotation.y += Math.PI * 0.01;
        }
    }
    if(key_pressed[32]){
        if(shoot1){
            bombSound1.play(true);
            temp = bomb.clone();
            temp.rotation.y = cannon1[0].rotation.y + tank1.rotation.y;
            temp.position.set(tank1.position.x - 7 * Math.sin(temp.rotation.y)
                              , 1.8
                              , tank1.position.z - 7 * Math.cos(temp.rotation.y));
            bombs.push(temp);
            bombsDist.push(0);
            scene.add(temp);
            shoot1 = false;
            setTimeout(function(){shoot1 = true;}, 1500);
        }
    }
    if(key_pressed[13]){
        if(shoot2){
            bombSound2.play(true);
            temp = bomb.clone();
            temp.rotation.y = cannon2[0].rotation.y + tank2.rotation.y;
            temp.position.set(tank2.position.x - 7 * Math.sin(temp.rotation.y)
                              , 1.8
                              , tank2.position.z - 7 * Math.cos(temp.rotation.y));
            bombs.push(temp);
            bombsDist.push(0);
            scene.add(temp);
            shoot2 = false;
            setTimeout(function(){shoot2 = true;}, 1500);
        }
    }
    tank1.boundingBox = new THREE.Box3().setFromObject(tank1.children[0]);
    tank2.boundingBox = new THREE.Box3().setFromObject(tank2.children[0]);
    for(var key in bombs){
        bombs[key].position.x -= Math.sin(bombs[key].rotation.y) * 2;
        bombs[key].position.z -= Math.cos(bombs[key].rotation.y) * 2;
        bombsDist[key] += 2;
        bombs[key].position.y = 1.8 - bombsDist[key] / 200;
        bombs[key].boundingBox = new THREE.Box3().setFromObject(bombs[key]);
        if(bombs[key].boundingBox.intersectsBox(tank1.boundingBox)){
            scene.remove(bombs[key]);
            delete bombs[key];
            delete bombsDist[key];
            life1 -= 5;
            if(life1 === 0){
                scene.remove(tank1);
                refresh = false;
                $("#exit").show();
                compare();
                clearInterval(interval);
                spectrum();
                setInterval(spectrum, 3000);
            }
            $("#dead1").css("left", life1 + "%");
            $("#dead1").css("width", (100 - life1) + "%");
        }
        else if(bombs[key].boundingBox.intersectsBox(tank2.boundingBox)){
            scene.remove(bombs[key]);
            delete bombs[key];
            delete bombsDist[key];
            life2 -= 5;
            if(life2 === 0){
                scene.remove(tank2);
                refresh = false;
                $("#exit").show();
                compare();
                clearInterval(interval);
                spectrum();
                setInterval(spectrum, 3000);
            }
            $("#dead2").css("width", (100 - life2) + "%");
        }
        else if(bombsDist[key] >= 200 || Math.abs(bombs[key].position.x) >= 255 || Math.abs(bombs[key].position.z) >= 255){
            scene.remove(bombs[key]);
            delete bombs[key];
            delete bombsDist[key];
        }
    }
    camera1.rotation.y = tank1.rotation.y;
    camera2.rotation.y = tank2.rotation.y;
    camera1.position.set(tank1.position.x + 11.7 * Math.sin(tank1.rotation.y)
                        , camera1.position.y
                        , tank1.position.z + 11.7 * Math.cos(tank1.rotation.y));
    camera2.position.set(tank2.position.x + 11.7 * Math.sin(tank2.rotation.y)
                        , camera2.position.y
                        , tank2.position.z + 11.7 * Math.cos(tank2.rotation.y));
    $("#position1").html("x:" + tank1.position.x.toFixed(2) + " y:" + tank1.position.y.toFixed(2) + " z:" + tank1.position.z.toFixed(2));
    $("#position2").html("x:" + tank2.position.x.toFixed(2) + " y:" + tank2.position.y.toFixed(2) + " z:" + tank2.position.z.toFixed(2));
}
//偵測按壓鍵盤事件
window.addEventListener("keydown", function(event){
    key_pressed[event.keyCode] = true;
})
//偵測放開鍵盤事件
window.addEventListener("keyup", function(event){
    key_pressed[event.keyCode] = false;
})
//回到主畫面
$("#exit").click(function(event){
    history.go(-1);
});

function compare(){
    if(life1 === life2){
        $("#bgBlack1").show();
        $("#bgBlack2").show();
        $("#end1").html("draw");
        $("#end1").css("color", "greenyellow");
        $("#end2").html("draw");
        $("#end2").css("color", "greenyellow");
    }
    else if(life1 > life2){
        $("#bgBlack2").show();
        $("#end1").html("win");
        $("#end1").css("color", "red");
        $("#end2").html("lose");
        $("#end2").css("color", "white");
    }
    else if(life2 > life1){
        $("#bgBlack1").show();
        $("#end1").html("lose");
        $("#end1").css("color", "white");
        $("#end2").html("win");
        $("#end2").css("color", "red");
    }
}

function spectrum(){
    var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
    $('#exit').animate({color:hue}, 3000);
}

var interval = setInterval(function(){
    --time;
    $("#time").html(parseInt(time / 60) + ":" + parseInt(time % 60 / 10) + time % 10);
    if(time === 0){
        $("#exit").show();
        refresh = false;
        spectrum();
        clearInterval(interval);
        setInterval(spectrum, 3000);
        compare();
    }
}, 1000);