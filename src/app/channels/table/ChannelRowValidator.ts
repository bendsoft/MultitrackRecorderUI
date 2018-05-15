import {ChannelRow} from './ChannelRow';
import {FormControl} from '@angular/forms';

export class ChannelRowValidator {
  public static checkUnique(
    formControlName: string,
    channelRows: ChannelRow[],
    propagateErrorToDuplicates: boolean,
    changedFormControl: FormControl
  ) {
    let isUnique = true;
    channelRows
      .map(row => row.rowFormGroup.get(formControlName) as FormControl)
      .filter(formControl => !Object.is(formControl, changedFormControl) && formControl.value === changedFormControl.value)
      .forEach(formControl => {
        isUnique = false;

        if (propagateErrorToDuplicates) {
          formControl.setErrors({'notUnique': true});
        } else {
          formControl.setErrors(null);
        }
      });

    return isUnique ? null : { 'notUnique': true };
  }
}
