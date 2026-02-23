
const BlurCircle = ({top = "auto", left = "auto", right = "auto", bottom = "auto"}) => {
  return (
    <div className="absolute -z-50 bg-primary/30 h-58 w-58 aspect-square rounded-full blur-3xl"
    style={{top: top, left:left, right:right, bottom:bottom}}
    >
      
    </div>
  )
}

export default BlurCircle