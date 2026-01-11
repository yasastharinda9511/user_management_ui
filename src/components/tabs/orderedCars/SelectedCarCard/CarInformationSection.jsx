import EditableField from '../EditableField.jsx';
import {formatCurrency} from '../../../../utils/common.js';

const CarInformationSection = ({
                                   editedData,
                                   editingSection,
                                   vehicle,
                                   updateField,
                               }) => {


    return (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            <EditableField
                label="Make"
                value={editedData.vehicle?.make || ''}
                section="vehicle"
                field="make"
                isEditing={false}
                currentValue={editedData.vehicle?.make || ''}
                updateField={updateField}
            />
            <EditableField
                label="Model"
                value={editedData.vehicle?.model || ''}
                section="vehicle"
                field="model"
                isEditing={false}
                currentValue={editedData.vehicle?.model || ''}
                updateField={updateField}
            />
            <EditableField
                label="Vehicle Code"
                value={`${editedData.vehicle?.code || 'N/A'}`}
                section="vehicle"
                field="code"
                isEditing={editingSection !== null}
                currentValue={editedData.vehicle?.code || ''}
                updateField={updateField}
            />
            <EditableField
                label="Quoted Price"
                value={formatCurrency(editedData.vehicle?.price_quoted || '', 'LKR')}
                section="vehicle"
                field="price_quoted"
                type="number"
                isEditing={editingSection !== null}
                currentValue={editedData.vehicle?.price_quoted || ''}
                updateField={updateField}
            />
            <EditableField
                label="Auction Price"
                value={formatCurrency(editedData.vehicle?.auction_price || '' , editedData.vehicle?.currency ||'LKR')}
                section="vehicle"
                field="auction_price"
                type="number"
                isEditing={editingSection !== null}
                currentValue={editedData.vehicle?.auction_price || ''}
                updateField={updateField}
            />
            <EditableField
                label="Year"
                value={editedData.vehicle?.year_of_manufacture || ''}
                section="vehicle"
                field="year_of_manufacture"
                type="number"
                isEditing={editingSection !== null}
                currentValue={editedData.vehicle?.year_of_manufacture || ''}
                updateField={updateField}
            />
            <EditableField
                label="Color"
                value={editedData.vehicle?.color || ''}
                section="vehicle"
                field="color"
                isEditing={editingSection !== null}
                currentValue={editedData.vehicle?.color || ''}
                updateField={updateField}
            />
            <EditableField
                label="Trim Level"
                value={editedData.vehicle?.trim_level || ''}
                section="vehicle"
                field="trim_level"
                isEditing={editingSection !== null}
                currentValue={editedData.vehicle?.trim_level || ''}
                updateField={updateField}
            />
            <EditableField
                label="Mileage (km)"
                value={editedData.vehicle?.mileage_km ?
                    `${editedData.vehicle.mileage_km.toLocaleString()} km` :
                    (vehicle.mileage_km ?
                        `${vehicle.mileage_km.toLocaleString()} km` :
                        'N/A')}
                section="vehicle"
                field="mileage_km"
                type="number"
                isEditing={editingSection !== null}
                currentValue={editedData.vehicle?.mileage_km || 0}
                updateField={updateField}
            />
            <EditableField
                label="Condition"
                value={editedData.vehicle?.condition_status || ''}
                section="vehicle"
                field="condition_status"
                options={['REGISTERED', 'UNREGISTERED']}
                isEditing={editingSection !== null}
                currentValue={editedData.vehicle?.condition_status ||
                    vehicle.condition_status || 'UNREGISTERED'}
                updateField={updateField}
            />
            <EditableField
                label="Auction Grade"
                value={editedData.vehicle?.auction_grade ||
                    vehicle.auction_grade}
                section="vehicle"
                field="auction_grade"
                isEditing={editingSection !== null}
                currentValue={editedData.vehicle?.auction_grade ||
                    vehicle.auction_grade || ''}
                updateField={updateField}
            />
            <EditableField
                label="Auction Price"
                value={editedData.vehicle?.auction_price ?
                    editedData.vehicle.auction_price.toLocaleString() :
                    (vehicle.auction_price ?
                        vehicle.auction_price.toLocaleString() :
                        'N/A')}
                section="vehicle"
                field="auction_price"
                type="number"
                isEditing={editingSection !== null}
                currentValue={editedData.vehicle?.auction_price ||
                    vehicle.auction_price || 0}
                updateField={updateField}
            />
            <EditableField
                label="Quoted Price"
                value={editedData.vehicle?.price_quoted ?
                    editedData.vehicle.price_quoted.toLocaleString() :
                    (vehicle.price_quoted ?
                        vehicle.price_quoted.toLocaleString() :
                        'N/A')}
                section="vehicle"
                field="price_quoted"
                type="number"
                isEditing={editingSection !== null}
                currentValue={editedData.vehicle?.price_quoted ||
                    vehicle.price_quoted || 0}
                updateField={updateField}
            />
            <EditableField
                label="Chassis Number"
                value={editedData.vehicle?.chassis_id || vehicle.chassis_id}
                section="vehicle"
                field="chassis_id"
                isEditing={editingSection !== null}
                currentValue={editedData.vehicle?.chassis_id ||
                    vehicle.chassis_id || ''}
                updateField={updateField}
            />
            <EditableField
                label="Currency"
                value={editedData.vehicle?.currency || vehicle.currency}
                section="vehicle"
                field="currency"
                options={['JPY', 'USD', 'LKR', 'EUR']}
                isEditing={editingSection !== null}
                currentValue={editedData.vehicle?.currency ||
                    vehicle.currency ||
                    'LKR'}
                updateField={updateField}
            />
        </div>
    );

};

export default CarInformationSection;