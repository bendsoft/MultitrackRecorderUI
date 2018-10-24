import {FormControl} from '@angular/forms';
import {ChannelDataSource} from "./ChannelDataSource";

export class ChannelRowValidator {
  public static checkUnique(
    formControlName: string,
    channelRowsDataSource: ChannelDataSource,
    propagateErrorToDuplicates: boolean,
    changedFormControl: FormControl
  ) {
    const usedChannels = [];
    let changedFormControlFound = false;
    const formControls = channelRowsDataSource.getChannelRows()
      .map(row => {
        const formControl = row.rowFormGroup.get(formControlName) as FormControl;

        if (formControl === changedFormControl) {
          changedFormControlFound = true;
        }

        usedChannels.push(formControl.value);

        return formControl;
      });

    if(!changedFormControlFound && ChannelRowValidator.isChannelOccupied(changedFormControl.value, usedChannels)) {
      return { 'notUnique': true };
    }

    const nonUniqueChannels = ChannelRowValidator.getNonUniqueValues(usedChannels);
    let isUnique = true;
    formControls.forEach(formControl => {
      if (ChannelRowValidator.isChannelOccupied(formControl.value, nonUniqueChannels)) {
        if (propagateErrorToDuplicates) {
          formControl.setErrors({'notUnique': true});
        }

        if (changedFormControl.value === formControl.value) {
          isUnique = false;
        }
      } else {
        if (formControl.hasError('notUnique')) {
          formControl.setErrors(null);
        }
      }
    });

    return isUnique ? null : { 'notUnique': true };
  }

  private static isChannelOccupied(channel: number, channels: number[]) {
    return channels.some(usedChannel => usedChannel === channel);
  }

  private static getNonUniqueValues<T>(values: T[]): T[] {
    const sortedValues = values.slice().sort();

    const nonUniqueValues = new Set();
    for (let i = 0; i < sortedValues.length - 1; i++) {
      if (sortedValues[i + 1] == sortedValues[i]) {
        nonUniqueValues.add(sortedValues[i]);
      }
    }

    return Array.from(nonUniqueValues);
  }
}
