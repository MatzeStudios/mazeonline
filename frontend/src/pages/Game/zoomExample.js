console.clear();

const { useState, useEffect, useMemo, useCallback, useRef, forwardRef } = React;
const { Stage, Container, Sprite, PixiComponent, useApp, useTick } = ReactPixi;
const { Texture } = PIXI;

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const width = window.innerWidth;
const height = window.innerHeight;

const stageOptions = {
  antialias: true,
  autoDensity: true,
  backgroundColor: 0xefefef,
};

const areas = {
  'world': [1000, 1000, 2000, 2000],
  'center': [1000, 1000, 400, 400],
  'tl': [100, 100, 200, 200],
  'tr': [1900, 100, 200, 200],
  'bl': [100, 1900, 200, 200],
  'br': [1900, 1900, 200, 200]
};

useIteration = (incr = 0.1) => {
  const [i, setI] = React.useState(0);
  
  useTick((delta) => {
    setI(i => i + incr * delta);
  });

  return i;
};

  const useResize = () => {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
    
    useEffect(() => {
      const onResize = () => {
        requestAnimationFrame(() => {
          setSize([window.innerWidth, window.innerHeight])        
        })
      };
      
      window.addEventListener('resize', onResize);
      
      return () => {
        window.removeEventListener('resize', onResize);
      }
    }, []);
    
    return size;
  };

// create and instantiate the viewport component
// we share the ticker and interaction from app
const PixiViewportComponent = PixiComponent("Viewport", {
  create(props) {
    const { app, ...viewportProps } = props;

    const viewport = new Viewport.Viewport({
      ticker: props.app.ticker,
      interaction: props.app.renderer.plugins.interaction,
      ...viewportProps
    });

    // activate plugins
    (props.plugins || []).forEach((plugin) => {
      viewport[plugin]();
    });

    return viewport;
  },
  applyProps(viewport, _oldProps, _newProps) {
    const { plugins: oldPlugins, children: oldChildren, ...oldProps } = _oldProps;
    const { plugins: newPlugins, children: newChildren, ...newProps } = _newProps;

    Object.keys(newProps).forEach((p) => {
      if (oldProps[p] !== newProps[p]) {
        viewport[p] = newProps[p];
      }
    });
  },
  didMount() {
    console.log("viewport mounted");
  }
});

// create a component that can be consumed
// that automatically pass down the app
const PixiViewport = forwardRef((props, ref) => (
  <PixiViewportComponent ref={ref} app={useApp()} {...props} />
));

// Wiggling bunny
const Bunny = forwardRef((props, ref) => {
  // abstracted away, see settings>js
  const i = useIteration(0.1);
  
  return (
    <Sprite
      ref={ref}
      image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
      anchor={0.5}
      scale={2}
      rotation={Math.cos(i) * 0.98}
      {...props}
    />
  );
});

// 4 squared bunnies
// positioned by its name
const BunniesContainer = ({ name, ...props }) => {
  const [x, y] = areas[name];
  
  return (
    <Container x={x} y={y} {...props}>
      <Bunny x={-50} y={-50} />
      <Bunny x={50} y={-50} />
      <Bunny x={-50} y={50} />
      <Bunny x={50} y={50} />
    </Container>
  );
}

const BunnyFollowingCircle = forwardRef(({x, y, rad}, ref) => {
  const i = useIteration(0.02);
  return <Bunny ref={ref} x={x + Math.cos(i) * rad} y={y + Math.sin(i) * rad} scale={6} />
});

// the main app
const App = () => {
  // get the actual viewport instance
  const viewportRef = useRef();
  
  // get ref of the bunny to follow
  const followBunny = useRef();
  
  // get the current window size
  const [width, height] = useResize();
  
  // interact with viewport directly
  // move and zoom to specified area
  const focus = useCallback((p) => {
    const viewport = viewportRef.current;
    const [x, y, focusWidth, focusHeight] = areas[p];
    
    const f = Math.max(focusWidth / width, focusHeight / height);
    const w = width  * f;
    const h = height * f;
    
    // pause following
    viewport.plugins.pause('follow');
    
    // and snap to selected
    viewport.snapZoom({ width: w, height: h, removeOnComplete: true, ease: 'easeInOutExpo' });
    viewport.snap(x, y, { removeOnComplete: true, ease: 'easeInOutExpo' });
  }, [width, height]);
  
  const follow = useCallback(() => {
    const viewport = viewportRef.current;
    
    const focusWidth = 1000;
    const focusHeight = 1000;
    
    const f = Math.max(focusWidth / width, focusHeight / height);
    const w = width  * f;
    const h = height * f;
    
    viewport.snapZoom({ width: w, height: h, ease: 'easeInOutExpo' });
    viewport.follow(followBunny.current, { speed: 20 });
  }, [width, height]);
 
  return (
    <>
      <div class="buttons-group">
        <button onClick={() => focus('world')}>Fit</button>
        <button onClick={() => focus('center')}>Center</button>
        <button onClick={() => focus('tl')}>TL</button>
        <button onClick={() => focus('tr')}>TR</button>
        <button onClick={() => focus('bl')}>BL</button>
        <button onClick={() => focus('br')}>BR</button>
        <button onClick={() => follow()}>Follow</button>
      </div>
      
      <Stage width={width} height={height} options={stageOptions}>
        <PixiViewport
          ref={viewportRef}
          plugins={["drag", "pinch", "wheel", "decelerate"]}
          screenWidth={width}
          screenHeight={height}
          worldWidth={width * 4}
          worldHeight={height * 4}
        >
          <BunniesContainer name="tl" />
          <BunniesContainer name="tr" />
          <BunniesContainer name="bl" />
          <BunniesContainer name="br" />
          <BunniesContainer name="center" scale={2} />
          
          <BunnyFollowingCircle x={1000} y={1000} rad={500} ref={followBunny} />
        </PixiViewport>
      </Stage>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
