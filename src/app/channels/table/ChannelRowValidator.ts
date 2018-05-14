import {ChannelRow} from './ChannelRow';
import {FormControl} from '@angular/forms';

export class ChannelRowValidator {
  public static checkUnique(
    formControlName: string,
    channelRows: ChannelRow[],
    changedFormControl: FormControl
  ) {
    let isUnique = true;
    channelRows
      .map(row => row.rowFormGroup.get(formControlName) as FormControl)
      .forEach(formControl => {
        if (formControl.value === changedFormControl.value && formControl !== changedFormControl) {
          formControl.setErrors({ 'notUnique': true });
          isUnique = false;
        } else {
          formControl.setErrors(null);
        }
      });

    return isUnique ? null : { 'notUnique': true };
  }
}
