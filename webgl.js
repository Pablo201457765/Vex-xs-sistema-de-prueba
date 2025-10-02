(function(){
  // webgl animation module
  function createFallback(root){
    // simple animated background using 2D canvas
    var c = document.createElement('canvas');
    c.width = root.clientWidth;
    c.height = root.clientHeight;
    root.appendChild(c);
    var ctx = c.getContext('2d');
    var t=0;
    function loop(){
      t+=0.02;
      var g = ctx.createLinearGradient(0,0,c.width,c.height);
      g.addColorStop(0, '#050511');
      g.addColorStop(1, '#001018');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,c.width,c.height);
      // moving circles
      for(var i=0;i<5;i++){
        var x = (Math.sin(t*(0.6+i*0.2)+i)*0.5+0.5)*c.width;
        var y = (Math.cos(t*(0.4+i*0.3)+i)*0.5+0.5)*c.height;
        var r = 40 + 20*Math.sin(t*1.2+i);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0,150,200,0.08)';
        ctx.arc(x,y,r,0,Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  function createThree(root){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, root.clientWidth/root.clientHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
    renderer.setSize(root.clientWidth, root.clientHeight);
    root.appendChild(renderer.domElement);
    // light
    var light = new THREE.PointLight(0xffffff,1);
    light.position.set(5,5,5);
    scene.add(light);
    // create three glowing dots (spheres)
    var dots = [];
    var mat = new THREE.MeshBasicMaterial({color:0x00ccff});
    for(var i=0;i<3;i++){
      var g = new THREE.SphereGeometry(0.15,24,24);
      var m = new THREE.Mesh(g, mat.clone());
      m.position.x = (i-1)*0.6;
      m.position.y = -0.5;
      m.position.z = 0;
      scene.add(m);
      dots.push(m);
    }
    // create a plane showing the letter using canvas texture
    var canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    var ctx = canvas.getContext('2d');
    function updateText(letter, fullname, showFull){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      // background transparent
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.font = 'bold 320px Sans-serif';
      ctx.fillText(letter, canvas.width/2 - (showFull?120:0), canvas.height/2 - 10);
      if(showFull){
        ctx.font = 'bold 60px Sans-serif';
        ctx.fillText(fullname, canvas.width/2 + 180, canvas.height/2 + 180);
      }
    }
    updateText('V','VEX XS', false);
    var tex = new THREE.CanvasTexture(canvas);
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(3,1.5), new THREE.MeshBasicMaterial({map:tex, transparent:true}));
    plane.position.z = -1;
    scene.add(plane);

    camera.position.z = 3;

    var t=0;
    var showFull=false;
    function animate(){
      t += 0.02;
      for(var i=0;i<dots.length;i++){
        dots[i].rotation.y += 0.03 + i*0.01;
        dots[i].position.y = -0.5 + Math.sin(t*2 + i)*0.05;
        // pulse
        var s = 1 + 0.2*Math.sin(t*4 + i);
        dots[i].scale.set(s,s,s);
      }
      // gradually reveal fullname after some time
      if(t>3.5 && !showFull){
        showFull=true;
        updateText('V','VEX XS', true);
        tex.needsUpdate = true;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    return {
      dispose: function(){ renderer.dispose(); root.removeChild(renderer.domElement); }
    };
  }

  window.VXSWebGL = {
    start: function(root){
      if(window.THREE === null){
        createFallback(root);
        return {dispose:function(){}};
      }
      if(window.THREE === undefined){
        // not yet loaded - wait a bit
        var waited=false;
        var iv = setInterval(function(){
          if(window.THREE !== undefined){
            clearInterval(iv);
            if(window.THREE === null){
              createFallback(root);
            } else {
              var inst = createThree(root);
              window._vxs_three_inst = inst;
            }
          }
        },200);
        return {dispose:function(){ clearInterval(iv); if(window._vxs_three_inst) window._vxs_three_inst.dispose(); }};
      } else {
        var inst = createThree(root);
        window._vxs_three_inst = inst;
        return inst;
      }
    },
    stop: function(){ if(window._vxs_three_inst) window._vxs_three_inst.dispose(); }
  };
})();