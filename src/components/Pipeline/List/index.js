import segmentWholeBrain from './segmentWholeBrain.json'
import segmentBrain22Labels from './segmentBrain22Labels.json'
import segmentBrain9Labels from './segmentBrain9Labels.json'
import svrRecon from './svrRecon.json'
import splitVolume from './splitVolume.json'
import localizeBrain from './localizeBrain.json'
import flirt from './flirt.json'
import fetalBrainVolumetricPipeline from './fetalBrainVolumetricPipeline.json'
import segmentWholeBrain_nr from './segmentWholeBrain_nr.json'
import binaryMaths from './binaryMaths.json'
import neonatalBrainVolumetricSegmentationPipeline from './neonatalBrainVolumetricSegmentationPipeline.json'

export const pipelines={
    'fetalBrainVolumetricPipeline':fetalBrainVolumetricPipeline,
    'neonatalBrainVolumetricSegmentationPipeline': neonatalBrainVolumetricSegmentationPipeline,
    'segmentWholeBrain':segmentWholeBrain,
    'segmentBrain22Labels':segmentBrain22Labels,
    'segmentBrain9Labels':segmentBrain9Labels,
    'svrRecon':svrRecon,
    'splitVolume':splitVolume,
    'localizeBrain':localizeBrain,
    'flirt':flirt,
    'segmentWholeBrain_nr':segmentWholeBrain_nr,
    'binaryMaths':binaryMaths
}