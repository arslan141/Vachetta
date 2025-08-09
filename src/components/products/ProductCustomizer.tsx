"use client";

import { useState, useEffect } from "react";
import { LeatherProductDocument, CustomConfiguration } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProductCustomizerProps {
  product: LeatherProductDocument;
  onConfigurationChange: (config: CustomConfiguration, totalPrice: number) => void;
}

export default function ProductCustomizer({ product, onConfigurationChange }: ProductCustomizerProps) {
  const [configuration, setConfiguration] = useState<CustomConfiguration>({
    leatherType: '',
    threadColor: '',
    hardwareFinish: '',
    monogram: {
      text: '',
      font: 'classic',
      placement: 'bottom-right'
    },
    additionalOptions: [],
    totalCustomizationCost: 0
  });

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [monogramText, setMonogramText] = useState('');

  // Group customization options by type
  const optionsByType = product.customizationOptions.reduce((acc, option) => {
    if (!acc[option.type]) {
      acc[option.type] = [];
    }
    acc[option.type].push(option);
    return acc;
  }, {} as Record<string, typeof product.customizationOptions>);

  useEffect(() => {
    calculatePrice();
  }, [selectedOptions, monogramText]);

  const calculatePrice = () => {
    let totalCustomizationCost = 0;
    const newConfiguration = { ...configuration };

    // Calculate cost from selected options
    Object.entries(selectedOptions).forEach(([type, value]) => {
      const option = product.customizationOptions.find(
        opt => opt.type === type && opt.value === value
      );
      if (option) {
        totalCustomizationCost += option.priceAdjustment;
        
        switch (type) {
          case 'leather_type':
            newConfiguration.leatherType = option.name;
            break;
          case 'thread_color':
            newConfiguration.threadColor = option.name;
            break;
          case 'hardware_finish':
            newConfiguration.hardwareFinish = option.name;
            break;
        }
      }
    });

    // Add monogram cost if text is provided
    if (monogramText.trim()) {
      const monogramOption = product.customizationOptions.find(
        opt => opt.type === 'monogram'
      );
      if (monogramOption) {
        totalCustomizationCost += monogramOption.priceAdjustment;
        newConfiguration.monogram!.text = monogramText.trim();
      }
    }

    newConfiguration.totalCustomizationCost = totalCustomizationCost;
    setConfiguration(newConfiguration);

    const totalPrice = product.basePrice + totalCustomizationCost;
    onConfigurationChange(newConfiguration, totalPrice);
  };

  const handleOptionSelect = (type: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const formatOptionName = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const isConfigurationComplete = () => {
    const requiredTypes = ['leather_type', 'thread_color', 'hardware_finish'];
    return requiredTypes.every(type => selectedOptions[type]);
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 rounded-lg">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Customize Your {product.name}</h3>
        <p className="text-gray-600">Personalize every detail to make it uniquely yours</p>
      </div>

      {/* Customization Options */}
      {Object.entries(optionsByType).map(([type, options]) => {
        if (type === 'monogram') return null; // Handle monogram separately
        
        return (
          <div key={type} className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">
              {formatOptionName(type)}
              {type !== 'monogram' && <span className="text-red-500 ml-1">*</span>}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(type, option.value)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedOptions[type] === option.value
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{option.name}</div>
                  {option.priceAdjustment > 0 && (
                    <div className="text-sm text-amber-600">+₹{option.priceAdjustment}</div>
                  )}
                  {option.priceAdjustment === 0 && (
                    <div className="text-sm text-gray-500">Included</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Monogram Section */}
      {optionsByType.monogram && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Personalization (Optional)</h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="monogram">Custom Text/Initials</Label>
              <Input
                id="monogram"
                type="text"
                value={monogramText}
                onChange={(e) => setMonogramText(e.target.value)}
                placeholder="Enter initials or text (max 10 characters)"
                maxLength={10}
                className="mt-1"
              />
              {optionsByType.monogram[0] && (
                <p className="text-sm text-gray-600 mt-1">
                  Additional ₹{optionsByType.monogram[0].priceAdjustment} for personalization
                </p>
              )}
            </div>

            {monogramText && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="font">Font Style</Label>
                  <select
                    id="font"
                    value={configuration.monogram?.font || 'classic'}
                    onChange={(e) => setConfiguration(prev => ({
                      ...prev,
                      monogram: { ...prev.monogram!, font: e.target.value }
                    }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="classic">Classic</option>
                    <option value="modern">Modern</option>
                    <option value="script">Script</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="placement">Placement</Label>
                  <select
                    id="placement"
                    value={configuration.monogram?.placement || 'bottom-right'}
                    onChange={(e) => setConfiguration(prev => ({
                      ...prev,
                      monogram: { ...prev.monogram!, placement: e.target.value }
                    }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-center">Bottom Center</option>
                    <option value="front-center">Front Center</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Price Summary */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base Price:</span>
            <span>₹{product.basePrice}</span>
          </div>
          {configuration.totalCustomizationCost > 0 && (
            <div className="flex justify-between">
              <span>Customization:</span>
              <span>+${configuration.totalCustomizationCost}</span>
            </div>
          )}
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total Price:</span>
            <span>₹{product.basePrice + configuration.totalCustomizationCost}</span>
          </div>
        </div>
      </div>

      {/* Completion Status */}
      {!isConfigurationComplete() && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            Please select all required options marked with * to continue
          </p>
        </div>
      )}

      {/* Crafting Time */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Estimated crafting time:</strong> {product.craftingTime} business days
        </p>
      </div>
    </div>
  );
}
