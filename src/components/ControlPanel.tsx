import { Play, Pause, RotateCcw, StepForward, Download, Shuffle } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useReactionDiffusion } from '../hooks/useReactionDiffusion';
import { palettes, type PaletteName } from '../simulation/colorPalettes';
import { presets, type Preset } from '../simulation/presets';
import type { GrayScottParams } from '../simulation/grayScott';

interface ControlPanelProps {
  simulator: ReturnType<typeof useReactionDiffusion>;
  params: GrayScottParams;
  onParamsChange: (params: GrayScottParams) => void;
  paletteName: PaletteName;
  onPaletteChange: (palette: PaletteName) => void;
  resolution: number;
  onResolutionChange: (resolution: number) => void;
  stepsPerFrame: number;
  onStepsPerFrameChange: (steps: number) => void;
  onPresetSelect?: (preset: Preset) => void;
}

export function ControlPanel({
  simulator,
  params,
  onParamsChange,
  paletteName,
  onPaletteChange,
  resolution,
  onResolutionChange,
  stepsPerFrame,
  onStepsPerFrameChange,
  onPresetSelect,
}: ControlPanelProps) {

  const handlePresetSelect = (presetName: string) => {
    if (!presetName) return;
    const preset = presets.find(p => p.name === presetName);
    if (preset && onPresetSelect) {
      onPresetSelect(preset);
    }
  };

  const paletteOptions = Object.keys(palettes).map(name => ({
    value: name,
    label: name,
  }));

  const presetOptions = presets.map(p => ({
    value: p.name,
    label: p.name,
  }));

  const resolutionOptions = [
    { value: '128', label: '128×128 (Fast)' },
    { value: '256', label: '256×256 (Balanced)' },
    { value: '512', label: '512×512 (Slow)' },
  ];

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Simulation Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={simulator.isPlaying ? simulator.pause : simulator.play}
              className="flex-1"
              aria-label={simulator.isPlaying ? 'Pause simulation' : 'Play simulation'}
            >
              {simulator.isPlaying ? (
                <>
                  <Pause className="mr-2 h-4 w-4" aria-hidden="true" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                  Play
                </>
              )}
            </Button>
            <Button 
              onClick={simulator.step} 
              variant="outline"
              aria-label="Step simulation forward one frame"
            >
              <StepForward className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button 
              onClick={simulator.reset} 
              variant="outline"
              aria-label="Reset simulation to initial state"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button 
              onClick={simulator.randomSeed} 
              variant="outline"
              aria-label="Generate random seed pattern"
            >
              <Shuffle className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <Button 
            onClick={simulator.exportPNG} 
            variant="outline" 
            className="w-full"
            aria-label="Download current simulation frame as PNG"
          >
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            Download PNG
          </Button>
        </CardContent>
      </Card>

      {/* Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Slider
            label={`Feed Rate (F): ${params.f.toFixed(4)}`}
            value={[params.f]}
            onValueChange={([value]) => onParamsChange({ ...params, f: value })}
            min={0.0}
            max={0.1}
            step={0.001}
          />
          <Slider
            label={`Kill Rate (k): ${params.k.toFixed(4)}`}
            value={[params.k]}
            onValueChange={([value]) => onParamsChange({ ...params, k: value })}
            min={0.0}
            max={0.1}
            step={0.001}
          />
          <Slider
            label={`Diffusion U (DU): ${params.du.toFixed(4)}`}
            value={[params.du]}
            onValueChange={([value]) => onParamsChange({ ...params, du: value })}
            min={0.0}
            max={0.3}
            step={0.001}
          />
          <Slider
            label={`Diffusion V (DV): ${params.dv.toFixed(4)}`}
            value={[params.dv]}
            onValueChange={([value]) => onParamsChange({ ...params, dv: value })}
            min={0.0}
            max={0.3}
            step={0.001}
          />
          <Slider
            label={`Speed: ${stepsPerFrame} step${stepsPerFrame !== 1 ? 's' : ''} per frame`}
            value={[stepsPerFrame]}
            onValueChange={([value]) => onStepsPerFrameChange(value)}
            min={1}
            max={10}
            step={1}
          />
        </CardContent>
      </Card>

      {/* Presets */}
      <Card>
        <CardHeader>
          <CardTitle>Presets</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={undefined}
            onValueChange={handlePresetSelect}
            options={presetOptions}
            placeholder="Select a preset..."
            aria-label="Select simulation preset"
          />
        </CardContent>
      </Card>

      {/* Visual Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Visual Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="palette-select" className="block text-sm font-medium text-yellow-400 mb-2">
              Color Palette
            </label>
            <Select
              id="palette-select"
              value={paletteName}
              onValueChange={(value) => onPaletteChange(value as PaletteName)}
              options={paletteOptions}
              placeholder="Select color palette"
            />
          </div>
          <div>
            <label htmlFor="resolution-select" className="block text-sm font-medium text-yellow-400 mb-2">
              Resolution
            </label>
            <Select
              id="resolution-select"
              value={resolution.toString()}
              onValueChange={(value) => onResolutionChange(parseInt(value))}
              options={resolutionOptions}
              placeholder="Select resolution"
            />
            {resolution === 512 && (
              <p className="mt-2 text-xs text-yellow-400/70">
                Warning: High resolution may impact performance
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

